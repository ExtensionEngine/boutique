const { createError } = require('../common/errors');
const ctrl = require('./content-delivery.controller');
const { Enrollment } = require('../common/database');
const HttpStatus = require('http-status');
const router = require('express').Router();

const { UNAUTHORIZED } = HttpStatus;

router
  .use('/*', hasAccess)
  .get('/', ctrl.list)
  .get('/:contentId', ctrl.get)
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

module.exports = {
  router
};
