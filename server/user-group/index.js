'use strict';

const { FORBIDDEN, NOT_FOUND } = require('http-status');
const { User, UserGroup, UserGroupMember } = require('../common/database');
const { createError } = require('../common/errors');
const ctrl = require('./user-group.controller');
const path = require('path');
const userGroupMember = require('../user-group-member');
const router = require('express').Router();

router
  .param('userGroupId', getUserGroup)
  .use('/:userGroupId', hasUserGroupAccess)
  .patch('/:userGroupId', ctrl.patch)
  .get('/:userGroupId', ctrl.get)
  .delete('/:userGroupId', ctrl.remove);

router
  .get('/', ctrl.list)
  .post('/', hasCreationAccess, ctrl.create);

router
  .use(path.join('/:userGroupId', userGroupMember.path), userGroupMember.router);

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

async function hasCreationAccess({ user, query: { parentId } }, _, next) {
  if (user.isAdmin() || !parentId) return next();
  const where = { userId: user.id, userGroupId: parentId };
  const member = await UserGroupMember.findOne({ where });
  if (!member) return createError(NOT_FOUND, 'Not found!');
  return member.isInstructor() ? next() : createError(FORBIDDEN, 'Forbidden!');
}

async function hasUserGroupAccess({ user, userGroup }, _, next) {
  if (user.isAdmin()) return next();
  const where = { userId: user.id, userGroupId: userGroup.id };
  const member = await UserGroupMember.findOne({ where });
  if (!member) return createError(NOT_FOUND, 'Not found!');
  return member.isInstructor() ? next() : createError(FORBIDDEN, 'Forbidden!');
}
