'use strict';

const { FORBIDDEN, NOT_FOUND } = require('http-status');
const { createError } = require('../common/errors');
const ctrl = require('./user-group-membership.controller');
const { UserGroupMembership } = require('../common/database');
const router = require('express').Router();

router
  .param('userId', getMembership)
  .use('/:userId', hasMemberAccess)
  .patch('/:userId', ctrl.patch)
  .delete('/:userId', ctrl.remove);

router
  .get('/', ctrl.list)
  .post('/', ctrl.create);

async function getMembership(req, _, next, userId) {
  const where = { userGroupId: req.userGroup.id, userId };
  const membership = await UserGroupMembership.findOne({ where });
  if (!membership) return createError(NOT_FOUND, 'Not found!');
  req.membership = membership;
  next();
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
