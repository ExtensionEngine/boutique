'use strict';

const ctrl = require('./preview.controller');
const router = require('express').Router();

router
  .post('/', ctrl.createPreview)
  .get('/:containerId', ctrl.fetchPreview);

module.exports = {
  path: '/preview',
  router
};
