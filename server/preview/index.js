'use strict';

const cors = require('cors');
const ctrl = require('./preview.controller');
const router = require('express').Router();

router
  .post('/', cors(), ctrl.createPreview)
  .get('/:containerId', ctrl.fetchPreview);

module.exports = {
  path: '/preview',
  router
};
