'use strict';

const ctrl = require('./user.controller');
const router = require('express').Router();

router
  .post('/login', ctrl.login);

module.exports = {
  path: '/user',
  router
};
