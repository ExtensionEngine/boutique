'use strict';

const { createError } = require('../common/errors');
const ctrl = require('./enrollment-offering.controller');
const { EnrollmentOffering } = require('../common/database');
const { NOT_FOUND } = require('http-status');
const router = require('express').Router();
const offeringUserGroup = require('../offering-user-group');
const path = require('path');

router.get('/', ctrl.list);

router.param('offeringId', getOffering);
router.use(path.join('/:offeringId', offeringUserGroup.path), offeringUserGroup.router);

async function getOffering(req, _, next, offeringId) {
  const offering = await EnrollmentOffering.findByPk(offeringId);
  if (!offering) return createError(NOT_FOUND, 'Not found!');
  req.offering = offering;
  next();
}

module.exports = {
  path: '/offerings',
  router
};
