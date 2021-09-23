'use strict';

const { CONFLICT, NO_CONTENT } = require('http-status');
const { Sequelize, sequelize, UserGroupMembership } = require('../common/database');
const { createError } = require('../common/errors');
const enrollmentService = require('../enrollment/enrollment.service');
const map = require('lodash/map');

const { Op } = Sequelize;

const createUserFilter = q => map(['email', 'firstName', 'lastName'],
  it => ({ [it]: { [Op.iLike]: `%${q}%` } }));

function list({ query, userGroup, options }, res) {
  const filter = query.filter ? JSON.parse(query.filter) : {};
  const where = { userGroupId: userGroup.id };
  const userWhere = filter.user ? { [Op.or]: createUserFilter(filter.user) } : {};
  if (filter.role) where.role = filter.role;
  const opts = { ...options, where };
  return UserGroupMembership.withUser({ where: userWhere }).findAndCountAll(opts)
    .then(({ rows, count }) => res.jsend.success({ items: rows, total: count }));
}

function create({ userGroup, body }, res) {
  const { user, role } = body;
  const payload = { userGroupId: userGroup.id, userId: user.id, role };
  return sequelize.transaction(async transaction => {
    const opts = { modelSearchKey: ['userId', 'userGroupId'], transaction };
    const [err, membership] = await UserGroupMembership.restoreOrCreate(payload, opts);
    await enrollmentService.enrollMembership(membership, { transaction });
    if (err) return createError(CONFLICT, 'Group membership exists!');
    return membership;
  })
  .then(res.jsend.success);
}

async function patch({ membership, body }, res) {
  const data = await membership.update({ role: body.role });
  return res.jsend.success(data);
}

function remove({ membership }, res) {
  return sequelize.transaction(async transaction => {
    await membership.destroy({ transaction });
    return enrollmentService.unenrollMembership(membership, { transaction });
  })
  .then(() => res.sendStatus(NO_CONTENT));
}

module.exports = {
  list,
  create,
  patch,
  remove
};
