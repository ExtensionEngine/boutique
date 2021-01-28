'use strict';

const { createError } = require('../common/errors');
const ctrl = require('./group.controller');
const { Group } = require('../common/database');
const { NOT_FOUND } = require('http-status');
const router = require('express').Router();

router.get('/upload-url', ctrl.getUploadUrl);

router
  .param('groupId', getGroup)
  .use('/:groupId')
  .get('/:groupId', ctrl.get)
  .patch('/:groupId', ctrl.update)
  .delete('/:groupId', ctrl.remove);

router
  .get('/', ctrl.list)
  .post('/', ctrl.create);

async function getGroup(req, _, next, groupId) {
  const group = await Group.findByPk(groupId);
  if (!group) return createError(NOT_FOUND, 'Not found!');
  req.group = group;
  next();
}

module.exports = {
  path: '/groups',
  router
};
