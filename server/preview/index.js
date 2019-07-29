'use strict';

const cors = require('cors');
const ctrl = require('./preview.controller');
const router = require('express').Router();

router
  .options('/', cors())
  .post('/', cors(), ctrl.createPreview)
  .get('/:activityId', ctrl.fetchPreview);

module.exports = {
  path: '/preview',
  router
};
