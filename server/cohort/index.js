'use strict';

const { authorize } = require('../common/auth/mw');
const { Cohort, ContentRepo, Enrollment } = require('../common/database');
const { createError } = require('../common/errors');
const ctrl = require('./cohort.controller');
const contentCtrl = require('../content-repo/content-delivery.controller');
const forEach = require('lodash/forEach');
const HttpStatus = require('http-status');
const includes = require('lodash/includes');
const router = require('express').Router();

const { NOT_FOUND, UNAUTHORIZED } = HttpStatus;

router
  .use('/:id*', getCohort)
  .get('/', authorize(), ctrl.list)
  .post('/', authorize(), ctrl.create)
  .get('/:id', authorize(), ctrl.get)
  .patch('/:id', authorize(), ctrl.patch)
  .use('/:id/content*', hasAccess)
  .get('/:id/content', contentCtrl.list)
  .use('/:id/content/:contentId*', getRepo)
  .get('/:id/content/:contentId', contentCtrl.get);

function getCohort(req, res, next) {
  return Cohort.findById(req.params.id, { paranoid: false })
    .then(cohort => cohort || createError(NOT_FOUND, 'Not found!'))
    .then(cohort => {
      req.cohort = cohort;
      next();
    });
}

function hasAccess(req, res, next) {
  const { user, cohort } = req;
  if (user.isAdmin()) return next();
  const opts = { where: { studentId: user.id }, attributes: ['cohortId'] };
  return Enrollment.all(opts)
    .then(enrollments => {
      let enrolledToCohort = false;
      forEach(enrollments, it => {
        if (it.cohortId === cohort.id) {
          enrolledToCohort = true;
          return false;
        }
      });
      if (enrolledToCohort) {
        next();
      } else {
        return createError(UNAUTHORIZED, 'Access restricted');
      }
    });
}

function getRepo(req, res, next) {
  const opts = { where: { id: req.params.contentId, cohortId: req.cohort.id } };
  return ContentRepo.findOne(opts)
    .then(repo => repo || createError(NOT_FOUND, 'Not found!'))
    .then(repo => {
      req.repo = repo;
      next();
    });
}

module.exports = {
  path: '/cohorts',
  router
};
