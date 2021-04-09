'use strict';

const { FORBIDDEN, NOT_FOUND } = require('http-status');
const { createError } = require('../common/errors');
const ctrl = require('./user-group-member.controller');
const { UserGroupMember } = require('../common/database');
const router = require('express').Router();

router
  .param('memberId', getMember)
  .use('/:memberId', hasMemberAccess)
  .patch('/:memberId', ctrl.patch)
  .delete('/:memberId', ctrl.remove);

router
  .get('/', ctrl.list)
  .post('/', ctrl.create);

async function getMember(req, _, next, memberId) {
  const member = await UserGroupMember.findByPk(memberId);
  if (!member) return createError(NOT_FOUND, 'Not found!');
  req.member = member;
  next();
}

function hasMemberAccess({ user, member }, _, next) {
  const isUserMember = user.id === member.userId;
  if (user.isAdmin() || member.isInstructor() || isUserMember) return next();
  return createError(FORBIDDEN, 'Forbidden!');
}

module.exports = {
  path: '/members',
  router
};
