'use strict';

const config = require('../config');
const { ContentRepo } = require('../common/database');
const { createError } = require('../common/errors');
const createStorage = require('../common/storage');

const Storage = createStorage(config.storage);

function list(req, res) {
  const opts = {
    where: { cohortId: req.cohort.id },
    attributes: { exclude: ['structure'] }
  };
  return ContentRepo.all(opts)
    .then(repos => res.jsend.success(repos));
}

function get(req, res) {
  return res.jsend.success(req.repo);
}

function getContainer(req, res) {
  const { cohort, params, repo } = req;
  return Storage.getContainer(cohort.id, repo.sourceId, params.containerId)
    .catch(() => createError())
    .then(container => res.jsend.success(container));
}

function getExam(req, res) {
  const { cohort, params, repo } = req;
  return Storage.getExam(cohort.id, repo.sourceId, params.examId)
    .catch(() => createError())
    .then(exam => res.jsend.success(exam));
}

module.exports = {
  list,
  get,
  getContainer,
  getExam
};
