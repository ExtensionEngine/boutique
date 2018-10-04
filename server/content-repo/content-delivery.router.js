const { ContentRepo } = require('../common/database');
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

function hasAccess({ program, user }, res, next) {
  if (user.isAdmin()) return next();
  return program.getEnrollment({ where: { studentId: user.id } })
    .then(enrollment => {
      if (!enrollment) return createError(FORBIDDEN, 'Access denied');
      return next();
    });
}

function getRepo(req, res, next) {
  return ContentRepo.findById(req.params.repositoryId)
    .then(repo => {
      if (!repo || repo.programId !== req.program.id) {
        return createError(NOT_FOUND, 'Not found!');
      }
      req.repo = repo;
      return next();
    });
}

module.exports = {
  router
};
