'use strict';

const auth = require('../common/auth');
const { createSheet } = require('../common/helpers');
const ctrl = require('./user.controller');
const multer = require('multer');
const router = require('express').Router();

const upload = multer({ storage: multer.memoryStorage() });

router
  .post('/login', auth.authenticate('local'), ctrl.login)
  .post('/forgotPassword', ctrl.forgotPassword)
  .post('/resetPassword', ctrl.resetPassword)
  .use(auth.authenticate('jwt'))
  .get('/', ctrl.list)
  .post('/', ctrl.create)
  .patch('/:id', ctrl.patch)
  .delete('/:id', ctrl.destroy)
  .post('/:id/invite', ctrl.invite)
  .post('/import', upload.single('file'), ctrl.bulkImport, createSheet)
  .get('/import/template', ctrl.getImportTemplate, createSheet);

module.exports = {
  path: '/users',
  router
};
