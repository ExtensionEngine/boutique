'use strict';

const { CONFLICT, NO_CONTENT } = require('http-status');
const { Sequelize, User, UserGroup } = require('../common/database');
const { createError } = require('../common/errors');
const yn = require('yn');

const { Op } = Sequelize;

function list({ query, options }, res) {
  const { parentId = null, filter, archived } = query;
  const where = {};
  if (parentId) where.parentId = parentId;
  if (filter) where.name = { [Op.iLike]: `%${filter.trim()}%` };
  const include = { model: User };
  Object.assign(options, { where, include });
  return UserGroup.findAndCountAll({ ...options, paranoid: !yn(archived) })
    .then(({ rows, count }) => res.jsend.success({ items: rows, total: count }));
}

async function create({ body }, res) {
  const { name, parentId = null } = body;
  const [err, userGroup] = await UserGroup.restoreOrCreate({ name, parentId });
  if (err) return createError(CONFLICT, 'User group exists!');
  return res.jsend.success(userGroup);
}

async function patch({ userGroup, body }, res) {
  const data = await userGroup.update({ name: body.name });
  res.jsend.success(data);
}

function remove({ userGroup }, res) {
  return userGroup.destroy().then(() => res.sendStatus(NO_CONTENT));
}

module.exports = {
  list,
  create,
  patch,
  remove
};
