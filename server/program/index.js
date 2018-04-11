'use strict';

const { createError } = require('../common/errors');
const { Program } = require('../common/database');
const ctrl = require('./program.controller');
const HttpStatus = require('http-status');
const router = require('express').Router();

const { NOT_FOUND } = HttpStatus;

router
  .use('/:id*', getProgram)
  .get('/', ctrl.list)
  .post('/', ctrl.create)
  .patch('/:id', ctrl.patch);

function getProgram(req, res, next) {
  return Program.findById(req.params.id, { paranoid: false })
    .then(program => program || createError(NOT_FOUND, 'Program not found'))
    .then(program => {
      req.program = program;
      next();
    });
}

module.exports = {
  path: '/programs',
  router
};
