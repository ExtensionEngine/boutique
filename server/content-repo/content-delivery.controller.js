'use strict';

const config = require('../config');
const { createError } = require('../common/errors');
const createStorage = require('../common/storage');
const HttpStatus = require('http-status');
const map = require('lodash/map');
const omit = require('lodash/omit');
const pick = require('lodash/pick');

const { NOT_FOUND } = HttpStatus;
const Storage = createStorage(config.storage);
const excludeCorrect = data => map(data, it => omit(it, 'data.correct'));

function list({ program }, res) {
  const attributes = ['id', 'schema', 'name', 'description', 'publishedAt'];
  return program.getContentRepos({ attributes })
    .then(repos => res.jsend.success(repos));
}

function get({ repo }, res) {
  const attributes = [
    'id', 'schema', 'name', 'description', 'structure', 'publishedAt'];
  return res.jsend.success(pick(repo, attributes));
}

function getContainer({ program, params, repo }, res) {
  return Storage.getContainer(repo.sourceId, params.containerId, program.id)
    .catch(() => createError(NOT_FOUND, 'Not found!'))
    .then(container => {
      return res.jsend.success({
        ...container,
        elements: excludeCorrect(container.elements)
      });
    });
}

function getExam({ program, params, repo }, res) {
  return Storage.getExam(repo.sourceId, params.examId, program.id)
    .catch(() => createError(NOT_FOUND, 'Not found!'))
    .then(exam => {
      return res.jsend.success({
        ...exam,
        groups: map(exam.groups, group => {
          return {
            ...group,
            assessments: excludeCorrect(group.assessments)
          };
        })
      });
    });
}

function getAssessments({ program, params, repo }, res) {
  return Storage.getAssessments(repo.sourceId, params.assessmentsId, program.id)
    .catch(() => createError(NOT_FOUND, 'Not found!'))
    .then(assessments => {
      return res.jsend.success(excludeCorrect(assessments));
    });
}

module.exports = {
  list,
  get,
  getContainer,
  getExam,
  getAssessments
};
