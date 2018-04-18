'use strict';

const multer = require('multer');
const router = require('express').Router();
const { uploadsDir } = require('../../server/config');
const ctrl = require('./school.controller');

const upload = multer({ dest: uploadsDir });

router
  .get('/', ctrl.list)
  .patch('/:id', ctrl.patch)
  .post('/import', upload.single('csv'), ctrl.handleImport)
  .delete('/:id', ctrl.destroy);

module.exports = {
  path: '/schools',
  router
};
