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
  .post('/', hasCreationAccess, ctrl.create);

async function getMember(req, _, next, memberId) {
  const member = await UserGroupMember.findByPk(memberId);
  if (!member) return createError(NOT_FOUND, 'Not found!');
  req.member = member;
  next();
}

module.exports = {
  path: '/members',
  router
};

async function hasCreationAccess({ user, userGroup }, _, next) {
  if (user.isAdmin()) return next();
  const where = { userId: user.id, userGroupId: userGroup.id };
  const member = await UserGroupMember.findOne({ where });
  if (!member) return createError(NOT_FOUND, 'Not found!');
  return member.isInstructor() ? next() : createError(FORBIDDEN, 'Forbidden!');
}

function hasMemberAccess({ user, member }, _, next) {
  if (user.isAdmin() || member.isInstructor()) return next();
  return createError(FORBIDDEN, 'Forbidden!');
}
