'use strict';

const auth = require('../common/auth').authenticate('jwt');
const ctrl = require('./user.controller');
const router = require('express').Router();
const multer = require('multer');
const uniqid = require('uniqid');
const mime = require('mime-types');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, './tmp/'); },
  filename: (req, file, cb) => {
    let extension = mime.extension(mime.contentType(file.originalname));
    cb(null, `${uniqid()}.${extension}`);
  }
});

const imageUpload = multer({ storage: multerStorage }).single('avatar');

router
  .post('/login', ctrl.login)
  .use(auth)
  .get('/', ctrl.list)
  .post('/', ctrl.create)
  .patch('/:id', ctrl.patch)
  .post('/forgotPassword', ctrl.forgotPassword)
  .post('/resetPassword', ctrl.resetPassword)
  .post('/:id/image', imageUpload, ctrl.saveAvatar);

module.exports = {
  path: '/users',
  router
};
