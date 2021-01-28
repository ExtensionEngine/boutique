'use strict';

const { CONFLICT, NO_CONTENT } = require('http-status');
const { createError } = require('../common/errors');
const { Group } = require('../shared/database');

async function list({ opts, query }, res) {
  const { parentId, archived } = query;
  if (parentId) opts.where.parentId = parentId;
  const { rows, count } = Group.findAndCountAll({ ...opts, paranoid: !archived });
  res.json({ items: rows, total: count });
}

async function create({ body }, res) {
  const { name, parentId = null } = body;
  const [err, group] = await Group.restoreOrBuild({ name, parentId });
  return err ? createError(CONFLICT, 'Group exists!') : res.json({ data: group });
}

async function patch({ group, body }, res) {
  const data = await group.update({ name: body.name });
  res.json({ data });
}

function remove({ group }, res) {
  return group.destroy()
    .then(() => res.status(NO_CONTENT).send());
}

module.exports = {
  list,
  create,
  patch,
  remove
};
