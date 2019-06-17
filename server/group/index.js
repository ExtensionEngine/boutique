'use strict';

const { createError } = require('../common/errors');
const ctrl = require('./group.controller');
const { Group } = require('../common/database');
const router = require('express').Router();

router
  .use('/:id*', getGroup)
  .get('/', ctrl.list)
  .post('/', ctrl.create)
  .patch('/:id', ctrl.patch)
  .delete('/:id', ctrl.destroy);

function getGroup(req, _, next) {
  Group.findById(req.params.id, { paranoid: false })
  .then(group => group || createError('Not found!'))
  .then(group => {
    req.group = group;
    next();
  });
}

module.exports = {
  path: '/groups',
  router
};
