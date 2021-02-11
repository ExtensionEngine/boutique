'use strict';

const { CONFLICT, NO_CONTENT } = require('http-status');
const { Sequelize, UserGroup } = require('../common/database');
const { createError } = require('../common/errors');
const yn = require('yn');

const { Op } = Sequelize;

async function list({ query, options }, res) {
  const { parentId = null, filter, archived, fetchAll } = query;
  const where = !fetchAll ? { parentId } : {};
  if (filter) where.name = { [Op.iLike]: `%${filter.trim()}%` };
  const opts = { ...options, where, paranoid: !yn(archived) };
  const { rows, count } = await UserGroup.findAndCountAll(opts);
  return res.jsend.success({ items: rows, total: count });
}

async function create({ body }, res) {
  const { id, name, parentId = null } = body;
  const [err, userGroup] = await UserGroup.restoreOrCreate({ id, name, parentId });
  if (err) return createError(CONFLICT, 'User group exists!');
  return res.jsend.success(userGroup);
}

function get({ userGroup }, res) {
  const alias = userGroup.parentId ? 'parent' : 'children';
  const include = { model: UserGroup, as: alias };
  return userGroup.reload({ include })
    .then(userGroup => res.jsend.success(userGroup));
}

async function patch({ userGroup, body }, res) {
  const data = await userGroup.update({ name: body.name });
  res.jsend.success(data);
}

async function remove({ userGroup }, res) {
  await userGroup.destroy();
  return res.sendStatus(NO_CONTENT);
}

module.exports = {
  list,
  create,
  get,
  patch,
  remove
};
