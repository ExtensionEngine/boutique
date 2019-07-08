'use strict';

const { authorize } = require('../common/auth/mw');
const contentRouter = require('../content-repo/content-delivery.router');
const { createError } = require('../common/errors');
const ctrl = require('./program.controller');
const HttpStatus = require('http-status');
const { Program } = require('../common/database');
const router = require('express').Router();

const { NOT_FOUND } = HttpStatus;

router
  .get('/current-user', ctrl.getEnrolledPrograms)
  .use('/:id*', getProgram)
  .get('/', authorize(), ctrl.list)
  .post('/', authorize(), ctrl.create)
  .get('/:id', authorize(), ctrl.get)
  .patch('/:id', authorize(), ctrl.patch)
  .delete('/:id', authorize(), ctrl.destroy)
  .use('/:id/content', contentRouter.router);

function getProgram(req, _, next) {
  return Program.findByPk(req.params.id, { paranoid: false })
    .then(program => program || createError(NOT_FOUND, 'Not found!'))
    .then(program => {
      req.program = program;
      next();
    });
}

module.exports = {
  path: '/programs',
  router
};
