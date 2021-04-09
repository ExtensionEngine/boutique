'use strict';

const { FORBIDDEN, NOT_FOUND } = require('http-status');
const { UserGroup, UserGroupMember } = require('../common/database');
const { createError } = require('../common/errors');
const ctrl = require('./user-group.controller');
const path = require('path');
const userGroupMember = require('../user-group-member');
const router = require('express').Router();

router
  .param('userGroupId', getUserGroup)
  .use('/:userGroupId', hasUserGroupAccess)
  .patch('/:userGroupId', ctrl.patch)
  .delete('/:userGroupId', ctrl.remove);

router
  .get('/', ctrl.list)
  .post('/', hasUserGroupAccess, ctrl.create);

router
  .use(path.join('/:userGroupId', userGroupMember.path), userGroupMember.router);

async function getUserGroup(req, _, next, userGroupId) {
  const userGroup = await UserGroup.findByPk(userGroupId);
  if (!userGroup) return createError(NOT_FOUND, 'Not found!');
  req.userGroup = userGroup;
  next();
}

async function hasUserGroupAccess({ body, user, userGroup = {} }, _, next) {
  const userGroupId = body.parentId || userGroup.id;
  if (user.isAdmin() || !userGroupId) return next();
  const where = { userId: user.id, userGroupId };
  const member = await UserGroupMember.findOne({ where });
  if (!member) return createError(NOT_FOUND, 'Not found!');
  return member.isInstructor() ? next() : createError(FORBIDDEN, 'Forbidden!');
}

module.exports = {
  path: '/user-groups',
  router
};
