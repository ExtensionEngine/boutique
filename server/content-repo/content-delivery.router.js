'use strict';

const {
  ContentRepo,
  Enrollment,
  EnrollmentOffering
} = require('../common/database');
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

async function hasAccess({ program, user }, _res, next) {
  if (user.isAdmin()) return next();
  const enrollment = await Enrollment.findOne({
    where: { learnerId: user.id },
    include: [{
      model: EnrollmentOffering,
      as: 'offering',
      where: { programId: program.id }
    }]
  });
  if (!enrollment) return createError(FORBIDDEN, 'Access denied');
  return next();
}

async function getRepo(req, _res, next) {
  const repo = await ContentRepo.findByPk(req.params.repositoryId);
  if (!repo || repo.programId !== req.program.id) {
    return createError(NOT_FOUND, 'Not found!');
  }
  req.repo = repo;
  return next();
}

module.exports = {
  router
};
