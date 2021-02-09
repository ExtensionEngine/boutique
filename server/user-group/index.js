'use strict';

const { createError } = require('../common/errors');
const ctrl = require('./user-group.controller');
const { NOT_FOUND } = require('http-status');
const path = require('path');
const { UserGroup } = require('../common/database');
const userGroupMember = require('../user-group-member');
const router = require('express').Router();

router
  .param('userGroupId', getUserGroup)
  .patch('/:userGroupId', ctrl.patch)
  .get('/:userGroupId', ctrl.get)
  .delete('/:userGroupId', ctrl.remove);

router
  .get('/', ctrl.list)
  .post('/', ctrl.create);

router.use(path.join('/:userGroupId', userGroupMember.path), userGroupMember.router);

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
