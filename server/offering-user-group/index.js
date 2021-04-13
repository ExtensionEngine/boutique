'use strict';

const { createError } = require('../common/errors');
const ctrl = require('./offering-user-group.controller');
const { NOT_FOUND } = require('http-status');
const router = require('express').Router();
const { OfferingUserGroup } = require('../common/database');

router
  .param('groupId', getUserGroup)
  .delete('/:groupId', ctrl.remove);

router
  .get('/', ctrl.list)
  .post('/', ctrl.create);

async function getUserGroup(req, _, next, groupId) {
  const offeringUserGroup = await OfferingUserGroup.findByPk(groupId);
  if (!offeringUserGroup) return createError(NOT_FOUND, 'Not found!');
  req.offeringUserGroup = offeringUserGroup;
  next();
}

module.exports = {
  path: '/user-groups',
  router
};
