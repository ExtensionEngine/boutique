'use strict';

const ctrl = require('./course.controller');
const router = require('express').Router();

router
  .get('/catalog', ctrl.getCatalog)
  .get('/', ctrl.list)
  .post('/', ctrl.create);

module.exports = {
  path: '/courses',
  router
};
