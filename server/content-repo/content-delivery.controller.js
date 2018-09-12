'use strict';

const config = require('../config');
const { ContentRepo } = require('../common/database');
const { createError } = require('../common/errors');
const createStorage = require('../common/storage');
const forEach = require('lodash/forEach');
const HttpStatus = require('http-status');

const { NOT_FOUND } = HttpStatus;
const Storage = createStorage(config.storage);

function list({ cohort }, res) {
  return cohort.getContent_repos({ attributes: { exclude: ['structure'] } })
    .then(repos => res.jsend.success(repos));
}

function get({ cohort, params }, res) {
  const opts = { where: { id: params.contentId, cohortId: cohort.id } };
  return ContentRepo.findOne(opts)
    .then(repo => repo || createError(NOT_FOUND, 'Not found!'))
    .then(repo => res.jsend.success(repo));
}

function getContainer({ cohort, params, sourceId }, res) {
  return Storage.getContainer(cohort.id, sourceId, params.containerId)
    .catch(() => createError())
    .then(container => res.jsend.success(container));
}

function getExam({ cohort, params, sourceId }, res) {
  return Storage.getExam(cohort.id, sourceId, params.examId)
    .catch(() => createError())
    .then(exam => {
      forEach(exam.groups, group => {
        forEach(group.assessments, it => {
          delete it.data.correct;
        });
      });
      return res.jsend.success(exam);
    });
}

function getAssessments({ cohort, params, sourceId }, res) {
  return Storage.getAssessments(cohort.id, sourceId, params.assessmentsId)
    .catch(() => createError())
    .then(assessments => {
      forEach(assessments, it => {
        delete it.data.correct;
      });
      return res.jsend.success(assessments);
    });
}

module.exports = {
  list,
  get,
  getContainer,
  getExam,
  getAssessments
};
