const { createError } = require('../common/errors');
const ctrl = require('./content-delivery.controller');
const HttpStatus = require('http-status');
const router = require('express').Router();

const { NOT_FOUND, FORBIDDEN } = HttpStatus;

router
  .use('/*', hasAccess)
  .get('/', ctrl.list)
  .use('/:repositoryId*', getRepo)
  .get('/:repositoryId', ctrl.get)
  .get('/:repositoryId/container/:containerId', ctrl.getContainer)
  .get('/:repositoryId/exam/:examId', ctrl.getExam)
  .get('/:repositoryId/assessments/:assessmentsId', ctrl.getAssessments);

function hasAccess({ cohort, user }, res, next) {
  if (user.isAdmin()) return next();
  return cohort.getEnrollments({ where: { studentId: user.id } })
    .then(enrollments => {
      if (!enrollments.length) return createError(FORBIDDEN, 'Access denied');
      return next();
    });
}

function getRepo(req, res, next) {
  return req.cohort.getContentRepos({ where: { id: req.params.repositoryId } })
    .then(repos => {
      if (!repos.length) return createError(NOT_FOUND, 'Not found!');
      req.repo = repos[0];
      return next();
    });
}

module.exports = {
  router
};
