'use strict';

const config = require('../config');
const { ContentRepo } = require('../common/database');
const { createError } = require('../common/errors');
const createStorage = require('../common/storage');

const Storage = createStorage(config.storage);

function list({ cohort }, res) {
  const opts = {
    where: { cohortId: cohort.id },
    attributes: { exclude: ['structure'] }
  };
  return ContentRepo.all(opts)
    .then(repos => res.jsend.success(repos));
}

function get({ repo }, res) {
  return res.jsend.success(repo);
}

function getContainer({ cohort, params, repo }, res) {
  return Storage.getContainer(cohort.id, repo.sourceId, params.containerId)
    .catch(() => createError())
    .then(container => res.jsend.success(container));
}

function getExam({ cohort, params, repo }, res) {
  return Storage.getExam(cohort.id, repo.sourceId, params.examId)
    .catch(() => createError())
    .then(exam => res.jsend.success(exam));
}

function getAssessments({ cohort, params, repo }, res) {
  return Storage.getAssessments(cohort.id, repo.sourceId, params.assessmentsId)
    .catch(() => createError())
    .then(assessments => res.jsend.success(assessments));
}

module.exports = {
  list,
  get,
  getContainer,
  getExam,
  getAssessments
};
