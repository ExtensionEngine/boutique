'use strict';

const ctrl = require('./content-repo.controller');
const router = require('express').Router();

router
  .get('/catalog', ctrl.getCatalog)
  .get('/', ctrl.list)
  .post('/', ctrl.upsert)
  .patch('/:id', ctrl.upsert);

module.exports = {
  path: '/content-repo',
  router
};
