'use strict';

const ctrl = require('./enrollment.controller');
const offeringCtrl = require('./enrollment-offering.controller');
const router = require('express').Router();

router
  .use('/offerings', offeringCtrl.list)
  .get('/', ctrl.list)
  .post('/', ctrl.create)
  .delete('/:id', ctrl.destroy);

module.exports = {
  path: '/enrollments',
  router
};
