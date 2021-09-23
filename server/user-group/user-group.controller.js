'use strict';

const { CONFLICT, NO_CONTENT } = require('http-status');
const { Sequelize, sequelize, UserGroup } = require('../common/database');
const { createError } = require('../common/errors');
const enrollmentService = require('../enrollment/enrollment.service');
const { UserGroupRole } = require('../../common/config');

const { Op } = Sequelize;

async function list({ query, options }, res) {
  const { parentId = null, userGroupIds, filter, fetchAll } = query;
  const where = !fetchAll ? { parentId } : {};
  if (filter) where.name = { [Op.iLike]: `%${filter.trim()}%` };
  if (userGroupIds) where[Op.not] = { id: userGroupIds };
  const { rows, count } = await UserGroup.findAndCountAll({ ...options, where });
  return res.jsend.success({ items: rows, total: count });
}

function create({ user, body }, res) {
  const { id, name, parentId = null } = body;
  const payload = id ? { id, name, parentId } : { name, parentId };
  return sequelize.transaction(async transaction => {
    const opts = { transaction };
    const [err, userGroup] = await UserGroup.restoreOrCreate(payload, opts);
    if (err) return createError(CONFLICT, 'User group exists!');
    await enrollmentService.enrollUserGroup(userGroup, body.deletedAt, opts);
    if (!user.isAdmin() && !parentId) await setGroupAdmin(user, userGroup, opts);
    return userGroup;
  })
  .then(res.jsend.success);
}

async function patch({ userGroup, body }, res) {
  const data = await userGroup.update({ name: body.name });
  return res.jsend.success(data);
}

function remove({ userGroup }, res) {
  return sequelize.transaction(async transaction => {
    await userGroup.remove({ transaction });
    return enrollmentService.unenrollUserGroup(userGroup, { transaction });
  })
  .then(() => res.sendStatus(NO_CONTENT));
}

module.exports = {
  list,
  create,
  patch,
  remove
};

function setGroupAdmin(user, userGroup, { transaction }) {
  const through = { role: UserGroupRole.INSTRUCTOR };
  return userGroup.addMember(user, { through, transaction });
}
