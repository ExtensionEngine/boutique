'use strict';

const { Cohort } = require('../common/database');

function listCohorts(req, res) {
  return Cohort.all({ where: { id: req.user.enrollments } })
    .then(cohorts => res.jsend.success(cohorts));
}

function getCohort(req, res) {
  return Cohort.findById(req.params.cohortId)
    .then(cohort => res.jsend.success(cohort));
}

function listRepos(req, res) {
  return res.jsend.success(req.repos);
}

function getRepo(req, res) {
  return res.jsend.success(req.repo);
}

module.exports = {
  listCohorts,
  getCohort,
  listRepos,
  getRepo
};
