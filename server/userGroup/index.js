'use strict';

const { createError } = require('../common/errors');
const ctrl = require('./userGroup.controller');
const { NOT_FOUND } = require('http-status');
const { UserGroup } = require('../common/database');
const router = require('express').Router();

router
  .param('userGroupId', getUserGroup)
  .patch('/:userGroupId', ctrl.patch)
  .delete('/:userGroupId', ctrl.remove)
  .get('/:userGroupId/members', ctrl.getMembers)
  .post('/:userGroupId/members', ctrl.addMember);

router
  .get('/', ctrl.list)
  .post('/', ctrl.create);

async function getUserGroup(req, _, next, userGroupId) {
  const userGroup = await UserGroup.findByPk(userGroupId);
  if (!userGroup) return createError(NOT_FOUND, 'Not found!');
  req.userGroup = userGroup;
  next();
}

module.exports = {
  path: '/user-groups',
  router
};
