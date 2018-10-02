'use strict';

const ctrl = require('./enrollment.controller');
const router = require('express').Router();

router
  .get('/current-user', ctrl.getUserEnrollments)
  .get('/', ctrl.list)
  .post('/', ctrl.create);

module.exports = {
  path: '/enrollments',
  router
};
