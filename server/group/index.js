'use strict';

const ctrl = require('./group.controller');
const router = require('express').Router();

router
  .get('/', ctrl.list)
  .post('/', ctrl.create)
  .patch('/:id', ctrl.patch)
  .delete('/:id', ctrl.destroy);

module.exports = {
  path: '/groups',
  router
};
