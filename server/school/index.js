'use strict';

const ctrl = require('./school.controller');
const router = require('express').Router();

router
  .get('/', ctrl.list);

module.exports = {
  path: '/schools',
  router
};
