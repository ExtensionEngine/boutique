'use strict';

const { CONFLICT, NO_CONTENT } = require('http-status');
const { User, UserGroup } = require('../common/database');
const { createError } = require('../common/errors');
const yn = require('yn');

function list({ opts, query }, res) {
  const { parentId = null, archived } = query;
  if (parentId) opts.where.parentId = parentId;
  const include = { model: User };
  return UserGroup.findAndCountAll({ ...opts, include, paranoid: !yn(archived) })
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
