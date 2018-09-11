const { ContentRepo, Enrollment } = require('../common/database');
const { createError } = require('../common/errors');
const ctrl = require('./content-delivery.controller');
const forEach = require('lodash/forEach');
const HttpStatus = require('http-status');
const router = require('express').Router();

const { NOT_FOUND, UNAUTHORIZED } = HttpStatus;

router
  .use('/*', hasAccess)
  .get('/', ctrl.list)
  .use('/:contentId*', getRepo)
  .get('/:contentId', ctrl.get);

function hasAccess(req, res, next) {
  const { cohort, user } = req;
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
  const { cohort, params } = req;
  const opts = { where: { id: params.contentId, cohortId: cohort.id } };
  return ContentRepo.findOne(opts)
    .then(repo => repo || createError(NOT_FOUND, 'Not found!'))
    .then(repo => {
      req.repo = repo;
      next();
    });
}

module.exports = {
  router
};
