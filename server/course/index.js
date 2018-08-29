'use strict';

const ctrl = require('./course.controller');
const router = require('express').Router();

router
  .get('/', ctrl.index)
  .get('/:id', ctrl.get)
  .get('/catalog', ctrl.getCatalog);

module.exports = {
  path: '/course',
  router
};
