const { ContentRepo, Enrollment } = require('../common/database');
const { createError } = require('../common/errors');
const ctrl = require('./content-delivery.controller');
const HttpStatus = require('http-status');
const router = require('express').Router();

const { NOT_FOUND, UNAUTHORIZED } = HttpStatus;

router
  .use('/*', hasAccess)
  .get('/', ctrl.list)
  .get('/:contentId', ctrl.get)
  .use('/:contentId/*', getRepoSourceId)
  .get('/:contentId/container/:containerId', ctrl.getContainer)
  .get('/:contentId/exam/:examId', ctrl.getExam)
  .get('/:contentId/assessments/:assessmentsId', ctrl.getAssessments);

function hasAccess({ cohort, user }, res, next) {
  if (user.isAdmin()) return next();
  const opts = { where: { studentId: user.id, cohortId: cohort.id } };
  return Enrollment.findOne(opts)
    .then(enrollment => {
      if (enrollment) return next();
      return createError(UNAUTHORIZED, 'Access restricted');
    });
}

function getRepoSourceId(req, res, next) {
  const { cohort, params } = req;
  const opts = {
    where: { id: params.contentId, cohortId: cohort.id },
    attributes: ['sourceId']
  };
  return ContentRepo.findOne(opts)
    .then(repo => repo || createError(NOT_FOUND, 'Not found!'))
    .then(repo => {
      req.sourceId = repo.sourceId;
      next();
    });
}

module.exports = {
  router
};
