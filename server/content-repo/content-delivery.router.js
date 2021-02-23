'use strict';

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

async function hasAccess({ program, user }, _res, next) {
  if (user.isAdmin()) return next();
  const where = { learnerId: user.id };
  const enrollment = await program.getEnrollment({ where });
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
