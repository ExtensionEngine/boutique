'use strict';

const ctrl = require('./user.controller');
const router = require('express').Router();

router
  .post('/login', ctrl.login)
  .post('/forgotPassword', ctrl.forgotPassword)
  .post('/resetPassword', ctrl.resetPassword);

module.exports = {
  path: '/users',
  router
};
