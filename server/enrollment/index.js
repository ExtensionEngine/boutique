'use strict';

const ctrl = require('./enrollment.controller');
const router = require('express').Router();

router
  .get('/', ctrl.list)
  .post('/', ctrl.create)
  .post('/bulkEnroll', ctrl.bulkEnroll)
  .delete('/:id', ctrl.destroy);

module.exports = {
  path: '/enrollments',
  router
};
