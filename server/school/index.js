'use strict';

const multer = require('multer');
const router = require('express').Router();
const ctrl = require('./school.controller');

const upload = multer({ dest: process.env.UPLOADS_DIR });

router
  .get('/', ctrl.list)
  .post('/import', upload.single('csv'), ctrl.handleImport)
  .delete('/:id', ctrl.destroy);

module.exports = {
  path: '/schools',
  router
};
