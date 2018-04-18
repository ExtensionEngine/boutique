'use strict';

const router = require('express').Router();
const ctrl = require('./district.controller');

router
  .get('/', ctrl.list);

module.exports = {
  path: '/districts',
  router
};
