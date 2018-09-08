'use strict';

const { Cohort } = require('../common/database');
const { createError } = require('../common/errors');
const ctrl = require('./cohort.controller');
const HttpStatus = require('http-status');
const router = require('express').Router();

const { NOT_FOUND } = HttpStatus;

router
  .use('/:id*', getCohort)
  .get('/', ctrl.list)
  .post('/', ctrl.create)
  .get('/:id', ctrl.get)
  .patch('/:id', ctrl.patch);

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
