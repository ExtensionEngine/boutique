'use strict';

const ctrl = require('./content-import.controller');
const router = require('express').Router();

router
  .get('/catalog', ctrl.getCatalog)
  .get('/', ctrl.list)
  .post('/', ctrl.upsert)
  .patch('/:id', ctrl.upsert)
  .delete('/:id', ctrl.destroy)
  .post('/:id/restore', ctrl.restore);

module.exports = {
  path: '/content-repo',
  router
};
