'use strict';

const ctrl = require('./content-import.controller');
const router = require('express').Router();

router
  .get('/catalog', ctrl.getCatalog)
  .get('/', ctrl.list)
  .post('/', ctrl.upsert)
  .patch('/:id', ctrl.upsert)
  .delete('/:id', ctrl.destroy);

module.exports = {
  path: '/content-repo',
  router
};
