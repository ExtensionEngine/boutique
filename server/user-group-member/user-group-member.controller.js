'use strict';

const { CONFLICT, NO_CONTENT } = require('http-status');
const { Sequelize, UserGroupMember } = require('../common/database');
const { createError } = require('../common/errors');
const map = require('lodash/map');

const { Op } = Sequelize;

const createUserFilter = q => map(['email', 'firstName', 'lastName'],
  it => ({ [it]: { [Op.iLike]: `%${q}%` } }));

function list({ query, userGroup, options }, res) {
  const filter = JSON.parse(query.filter);
  const where = { userGroupId: userGroup.id };
  const userWhere = filter.user ? { [Op.or]: createUserFilter(filter.user) } : {};
  if (filter.role) where.role = filter.role;
  const opts = { ...options, where };
  return UserGroupMember.withUser({ where: userWhere }).findAndCountAll(opts)
    .then(({ rows, count }) => res.jsend.success({ items: rows, total: count }));
}

async function create({ userGroup, body }, res) {
  const { id, user, role } = body;
  const payload = { id, userGroupId: userGroup.id, userId: user.id, role };
  const [err, member] = await UserGroupMember.restoreOrCreate(payload);
  if (err) return createError(CONFLICT, 'Group member exists!');
  return res.jsend.success(member);
}

async function patch({ member, body }, res) {
  const { user, role } = body;
  const data = await member.update({ userId: user.id, role });
  res.jsend.success(data);
}

async function remove({ member }, res) {
  await member.destroy();
  return res.sendStatus(NO_CONTENT);
}

module.exports = {
  list,
  create,
  patch,
  remove
};
