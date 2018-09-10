'use strict';

const ctrl = require('./studentApi.controller');
const { Enrollment, ContentRepo } = require('../common/database');
const forEach = require('lodash/forEach');
const includes = require('lodash/includes');
const router = require('express').Router();

router
  .use('/cohorts*', getEnrollments)
  .get('/cohorts', ctrl.listCohorts)
  .use('/cohorts/:cohortId*', hasAccess)
  .get('/cohorts/:cohortId', ctrl.getCohort)
  .use('/cohorts/:cohortId/content*', getRepos)
  .get('/cohorts/:cohortId/content', ctrl.listRepos)
  .get('/cohorts/:cohortId/content/:contentId*', hasAccessToRepo)
  .get('/cohorts/:cohortId/content/:contentId', ctrl.getRepo);

function getEnrollments(req, res, next) {
  const opts = { where: { studentId: req.user.id }, attributes: ['cohortId'] };
  return Enrollment.all(opts)
    .then(enrollments => {
      req.user.enrollments = [];
      forEach(enrollments, it => {
        req.user.enrollments.push(it.cohortId);
      });
      next();
    });
}

function getRepos(req, res, next) {
  const opts = {
    where: { cohortId: req.params.cohortId },
    attributes: { exclude: ['structure'] }
  };
  return ContentRepo.all(opts)
    .then(repos => {
      req.user.repos = [];
      forEach(repos, it => {
        req.user.repos.push(it.id);
      });
      req.repos = repos;
      next();
    });
}

function hasAccess(req, res, next) {
  if (includes(req.user.enrollments, parseInt(req.params.cohortId, 10))) {
    next();
  } else {
    res.sendStatus(401);
  }
}

function hasAccessToRepo(req, res, next) {
  if (includes(req.user.repos, parseInt(req.params.contentId, 10))) {
    return ContentRepo.findById(req.params.contentId)
      .then(repo => {
        req.repo = repo;
        next();
      });
  } else {
    res.sendStatus(401);
  }
}

module.exports = {
  path: '/',
  router
};
