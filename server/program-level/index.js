'use strict';

const { createError } = require('../common/errors');
const { ProgramLevel } = require('../common/database');
const ctrl = require('./program-level.controller');
const HttpStatus = require('http-status');
const router = require('express').Router();

const { NOT_FOUND } = HttpStatus;

router
  .use('/:id*', getProgramLevel)
  .get('/', ctrl.list)
  .post('/', ctrl.create)
  .get('/:id', ctrl.get)
  .patch('/:id', ctrl.patch);

function getProgramLevel(req, res, next) {
  return ProgramLevel.findById(req.params.id, { paranoid: false })
    .then(programLevel => programLevel || createError(NOT_FOUND, 'Not found!'))
    .then(programLevel => {
      req.programLevel = programLevel;
      next();
    });
}

module.exports = {
  path: '/program-levels',
  router
};
