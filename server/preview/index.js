'use strict';

const cors = require('cors');
const ctrl = require('./preview.controller');
const router = require('express').Router();

router
  .options('/', cors())
  .post('/', cors(), ctrl.getPreviewUrl)
  .get('/:id', ctrl.getActivity);

module.exports = {
  path: '/preview',
  router
};
