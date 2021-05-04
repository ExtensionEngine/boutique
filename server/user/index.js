'use strict';

const { authenticate, logout } = require('../common/auth');
const ctrl = require('./user.controller');
const multer = require('multer');
const router = require('express').Router();

const upload = multer({ storage: multer.memoryStorage() });

router
  .post('/login', authenticate('local', { setCookie: true }), ctrl.getProfile)
  .post('/forgotPassword', ctrl.forgotPassword)
  .post('/resetPassword', ctrl.resetPassword);

router
  .use(authenticate('jwt'))
  .get('/logout', logout({ middleware: true }), ctrl.logout)
  .get('/', ctrl.list)
  .post('/', ctrl.create)
  .get('/me', ctrl.getProfile)
  .patch('/:id', ctrl.patch)
  .delete('/:id', ctrl.destroy)
  .post('/:id/invite', ctrl.invite)
  .post('/import', upload.single('file'), ctrl.bulkImport)
  .get('/import/template', ctrl.getImportTemplate);

module.exports = {
  path: '/users',
  router
};
