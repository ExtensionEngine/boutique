'use strict';

const { FORBIDDEN, NOT_FOUND } = require('http-status');
const { createError } = require('../common/errors');
const ctrl = require('./user-group-membership.controller');
const { UserGroupMembership } = require('../common/database');
const router = require('express').Router();

router
  .param('userId', attachMembership)
  .use('/:userId', hasMemberAccess)
  .patch('/:userId', ctrl.patch)
  .delete('/:userId', ctrl.remove);

router
  .get('/', ctrl.list)
  .post('/', hasCreationAccess, ctrl.create);

async function attachMembership(req, _, next, userId) {
  req.membership = await getMembership(req.userGroup.id, userId);
  next();
}

async function hasCreationAccess({ user, userGroup }, _, next) {
  if (user.isAdmin()) return next();
  const membership = await getMembership(userGroup.id, user.id);
  return membership.isInstructor() ? next() : createError(FORBIDDEN, 'Forbidden!');
}

function hasMemberAccess({ user, membership }, _, next) {
  const isUserMember = user.id === membership.userId;
  if (user.isAdmin() || membership.isInstructor() || isUserMember) return next();
  return createError(FORBIDDEN, 'Forbidden!');
}

module.exports = {
  path: '/members',
  router
};

async function getMembership(userGroupId, userId) {
  const where = { userId, userGroupId };
  const membership = await UserGroupMembership.findOne({ where });
  return membership || createError(NOT_FOUND, 'Not found!');
}
