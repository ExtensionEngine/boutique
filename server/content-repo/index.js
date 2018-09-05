'use strict';

const ctrl = require('./content-repo.controller');
const router = require('express').Router();

router
  .get('/catalog', ctrl.getCatalog)
  .patch('/:id', ctrl.createOrUpdate)
  .get('/', ctrl.list)
  .post('/', ctrl.createOrUpdate);

module.exports = {
  path: '/content-repo',
  router
};
