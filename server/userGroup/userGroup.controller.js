'use strict';

const { CONFLICT, NO_CONTENT } = require('http-status');
const { Sequelize, UserGroup } = require('../common/database');
const { createError } = require('../common/errors');
const yn = require('yn');

const { Op } = Sequelize;

async function list({ query, options }, res) {
  const { parentId = null, filter, archived } = query;
  const where = {};
  if (parentId) where.parentId = parentId;
  if (filter) where.name = { [Op.iLike]: `%${filter.trim()}%` };
  Object.assign(options, { where, paranoid: !yn(archived) });
  const { rows, count } = await UserGroup.findAndCountAll(options);
  res.jsend.success({ items: rows, total: count });
}

async function create({ body }, res) {
  const { id, name, parentId = null } = body;
  const [err, userGroup] = await UserGroup.restoreOrCreate({ id, name, parentId });
  if (err) return createError(CONFLICT, 'User group exists!');
  return res.jsend.success(userGroup);
}

function get({ userGroup }, res) {
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
  get,
  patch,
  remove
};
