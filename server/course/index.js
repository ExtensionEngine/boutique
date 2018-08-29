'use strict';

const ctrl = require('./course.controller');
const router = require('express').Router();

router
  .get('/catalog', ctrl.getCatalog)
  .get('/', ctrl.index)
  .get('/:id', ctrl.get);

module.exports = {
  path: '/course',
  router
};
