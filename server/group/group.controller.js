'use strict';

const { CONFLICT, NO_CONTENT } = require('http-status');
const { createError } = require('../common/errors');
const { Group } = require('../common/database');

function list({ opts, query }, res) {
  const { parentId = null, archived } = query;
  if (parentId) opts.where.parentId = parentId;
  return Group.findAndCountAll({ ...opts, paranoid: !archived })
    .then(({ rows, count }) => res.jsend.success({ items: rows, total: count }));
}

async function create({ body }, res) {
  const { name, parentId = null } = body;
  const [err, group] = await Group.restoreOrCreate({ name, parentId });
  return err ? createError(CONFLICT, 'Group exists!') : res.jsend.success(group);
}

async function patch({ group, body }, res) {
  const data = await group.update({ name: body.name });
  res.jsend.success(data);
}

function remove({ group }, res) {
  return group.destroy()
    .then(() => res.sendStatus(NO_CONTENT));
}

module.exports = {
  list,
  create,
  patch,
  remove
};
