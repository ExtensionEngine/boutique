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
  const opts = {
    where: { cohortId: cohort.id },
    attributes: { exclude: ['structure'] }
  };
  return ContentRepo.all(opts)
    .then(repos => res.jsend.success(repos));
}

function get({ cohort, params }, res) {
  const opts = { where: { id: params.contentId, cohortId: cohort.id } };
  return ContentRepo.findOne(opts)
    .then(repo => repo || createError(NOT_FOUND, 'Not found!'))
    .then(repo => res.jsend.success(repo));
}

function getContainer({ cohort, params }, res) {
  return Storage.getContainer(cohort.id, params.contentId, params.containerId)
    .catch(() => createError())
    .then(container => res.jsend.success(container));
}

function getExam({ cohort, params }, res) {
  return Storage.getExam(cohort.id, params.contentId, params.examId)
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

function getAssessments({ cohort, params }, res) {
  return Storage.getAssessments(cohort.id, params.contentId, params.assessmentsId)
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
