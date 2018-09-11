const { ContentRepo, Enrollment } = require('../common/database');
const { createError } = require('../common/errors');
const ctrl = require('./content-delivery.controller');
const HttpStatus = require('http-status');
const router = require('express').Router();

const { NOT_FOUND, UNAUTHORIZED } = HttpStatus;

router
  .use('/*', hasAccess)
  .get('/', ctrl.list)
  .use('/:contentId*', getRepo)
  .get('/:contentId', ctrl.get)
  .get('/:contentId/container/:containerId', ctrl.getContainer)
  .get('/:contentId/exam/:examId', ctrl.getExam);

function hasAccess({ cohort, user }, res, next) {
  if (user.isAdmin()) return next();
  const opts = { where: { studentId: user.id, cohortId: cohort.id } };
  return Enrollment.count(opts)
    .then(count => {
      if (count) return next();
      return createError(UNAUTHORIZED, 'Access restricted');
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
