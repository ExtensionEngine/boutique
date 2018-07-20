'use strict';

const auth = require('../common/auth').authenticate('jwt');
const ctrl = require('./user.controller');
const router = require('express').Router();
const multer = require('multer');

const avatarFolderPath = require('path').join(__dirname, './avatars');
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, avatarFolderPath); },
  filename: (req, file, cb) => {
    cb(null, req.user.id + '.jpg');
  }
});
// TODO: remove custom storage; storing file in tmp folder instead, and handle actual storage later

const upload = multer({ storage: multerStorage });

router
  .post('/login', ctrl.login)
  .use(auth)
  .get('/', ctrl.list)
  .post('/', ctrl.create)
  .patch('/:id', ctrl.patch)
  .post('/forgotPassword', ctrl.forgotPassword)
  .post('/resetPassword', ctrl.resetPassword)
  .get('/:id/image', ctrl.getAvatar)
  .post('/:id/image', upload.single('avatar'), ctrl.saveAvatar);

module.exports = {
  path: '/users',
  router
};
