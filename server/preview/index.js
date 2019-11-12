'use strict';

const ctrl = require('./preview.controller');
const router = require('express').Router();

router
  .post('/', ctrl.getPreviewUrl)
  .get('/:id', ctrl.getActivity);

module.exports = {
  path: '/preview',
  router
};
