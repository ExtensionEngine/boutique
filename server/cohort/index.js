'use strict';

const { authorize } = require('../common/auth/mw');
const { Cohort } = require('../common/database');
const contentRouter = require('../content-repo/content-delivery.router');
const { createError } = require('../common/errors');
const ctrl = require('./cohort.controller');
const HttpStatus = require('http-status');
const router = require('express').Router();

const { NOT_FOUND } = HttpStatus;

router
  .use('/:id*', getCohort)
  .get('/', authorize(), ctrl.list)
  .post('/', authorize(), ctrl.create)
  .get('/:id', authorize(), ctrl.get)
  .patch('/:id', authorize(), ctrl.patch)
  .use('/:id/content', contentRouter.router);

function getCohort(req, res, next) {
  return Cohort.findById(req.params.id, { paranoid: false })
    .then(cohort => cohort || createError(NOT_FOUND, 'Not found!'))
    .then(cohort => {
      req.cohort = cohort;
      next();
    });
}

module.exports = {
  path: '/cohorts',
  router
};
