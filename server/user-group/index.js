'use strict';

const { FORBIDDEN, NOT_FOUND } = require('http-status');
const { UserGroup, UserGroupMembership } = require('../common/database');
const { createError } = require('../common/errors');
const ctrl = require('./user-group.controller');
const get = require('lodash/get');
const path = require('path');
const userGroupMembership = require('../user-group-membership');
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
  .use(path.join('/:userGroupId', userGroupMembership.path), userGroupMembership.router);

async function getUserGroup(req, _, next, userGroupId) {
  const userGroup = await UserGroup.findByPk(userGroupId);
  if (!userGroup) return createError(NOT_FOUND, 'Not found!');
  req.userGroup = userGroup;
  next();
}

async function hasUserGroupAccess({ body, user, userGroup }, _, next) {
  const { parentId } = body;
  const userGroupId = parentId || get(userGroup, 'id');
  if (user.isAdmin() || !userGroupId) return next();
  const where = { userId: user.id, userGroupId };
  const membership = await UserGroupMembership.findOne({ where });
  if (membership) {
    return membership.isInstructor() ? next() : createError(FORBIDDEN, 'Forbidden!');
  }
  const context = userGroup || { parentId };
  const hasAncestorInstructor = await UserGroup.hasAncestorInstructor(user, context);
  return hasAncestorInstructor ? next() : createError(NOT_FOUND, 'Not found!');
}

module.exports = {
  path: '/user-groups',
  router
};
