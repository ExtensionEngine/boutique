'use strict';

const { createError } = require('../common/errors');
const ctrl = require('./user-group-member.controller');
const { NOT_FOUND } = require('http-status');
const { UserGroupMember } = require('../common/database');
const router = require('express').Router();

router
  .param('memberId', getMember)
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

module.exports = {
  path: '/members',
  router
};
