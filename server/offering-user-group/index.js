'use strict';

const { createError } = require('../common/errors');
const ctrl = require('./offering-user-group.controller');
const { NOT_FOUND } = require('http-status');
const router = require('express').Router();
const { OfferingUserGroup } = require('../common/database');

router
  .param('userGroupId', getUserGroup)
  .delete('/:userGroupId', ctrl.remove);

router
  .get('/', ctrl.list)
  .post('/', ctrl.create);

async function getUserGroup(req, _, next, userGroupId) {
  const userGroup = await OfferingUserGroup.findByPk(userGroupId);
  if (!userGroup) return createError(NOT_FOUND, 'Not found!');
  req.userGroup = userGroup;
  next();
}

module.exports = {
  path: '/offering-user-group',
  router
};
