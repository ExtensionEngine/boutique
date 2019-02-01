'use strict';

const auth = require('../common/auth');
const ctrl = require('./user.controller');
const multer = require('multer');
const router = require('express').Router();

const upload = multer({ storage: multer.memoryStorage() });

router
  .post('/login', auth.authenticate('local'), ctrl.login)
  .post('/forgotPassword', ctrl.forgotPassword)
  .post('/resetPassword', ctrl.resetPassword)
  .get('/me', auth.authenticate(['jwt', 'token']), ctrl.getProfile)
  .post('/changePassword', auth.authenticate('jwt'), ctrl.changePassword)
  .use(auth.authenticate('jwt'))
  .get('/', ctrl.list)
  .post('/', ctrl.create)
  .patch('/:id', ctrl.patch)
  .delete('/:id', ctrl.destroy)
  .post('/:id/invite', ctrl.invite)
  .post('/import', upload.single('file'), ctrl.bulkImport);

module.exports = {
  path: '/users',
  router
};
