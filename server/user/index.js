'use strict';

const ctrl = require('./user.controller');
const router = require('express-promise-router')();

router
  .get('/', ctrl.list)
  .post('/', ctrl.create)
  .patch('/:id', ctrl.patch)
  .post('/login', ctrl.login)
  .post('/forgotPassword', ctrl.forgotPassword)
  .post('/resetPassword', ctrl.resetPassword);

module.exports = {
  path: '/users',
  router
};
