const { ContentRepo, Enrollment } = require('../common/database');
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
  const opts = { where: { studentId: user.id, cohortId: cohort.id } };
  return Enrollment.findOne(opts).then(enrollment => {
    if (enrollment) return next();
    return createError(FORBIDDEN, 'Access denied');
  });
}

function getRepo(req, res, next) {
  const opts = {
    where: { id: req.params.repositoryId, cohortId: req.cohort.id }
  };
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
