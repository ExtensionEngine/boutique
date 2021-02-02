'use strict';

const { createError } = require('../common/errors');
const HttpStatus = require('http-status');
const map = require('lodash/map');
const omit = require('lodash/omit');
const pick = require('lodash/pick');
const Storage = require('./content-storage');

const { NotFoundError } = Storage;
const { NOT_FOUND } = HttpStatus;

const excludeCorrect = data => map(data, it => omit(it, 'data.correct'));

function list({ program, query: { includeStructure } }, res) {
  const attributes = ['id', 'schema', 'name', 'description', 'publishedAt'];
  if (includeStructure) attributes.push('structure');
  return program.getContentRepos({ attributes })
    .then(repos => res.jsend.success(repos));
}

function get({ repo }, res) {
  const attrs = ['id', 'schema', 'name', 'description', 'structure', 'publishedAt'];
  return res.jsend.success(pick(repo, attrs));
}

function getContainer({ program, params, repo }, res) {
  return Storage.getContainer(repo.sourceId, params.containerId, program.id)
    .catch(NotFoundError, () => createError(NOT_FOUND, 'Not found!'))
    .then(processContainer)
    .then(container => res.jsend.success(container));
}

function getExam({ program, params, repo }, res) {
  return Storage.getExam(repo.sourceId, params.examId, program.id)
    .catch(NotFoundError, () => createError(NOT_FOUND, 'Not found!'))
    .then(exam => {
      const groups = map(exam.groups, group => ({
        ...group,
        assessments: excludeCorrect(group.assessments)
      }));
      return res.jsend.success({ ...exam, groups });
    });
}

function getAssessments({ program, params, repo }, res) {
  return Storage.getAssessments(repo.sourceId, params.assessmentsId, program.id)
    .catch(NotFoundError, () => createError(NOT_FOUND, 'Not found!'))
    .then(assessments => res.jsend.success(excludeCorrect(assessments)));
}

async function processContainer(container) {
  const elements = await Storage.resolveElements(container.elements);
  container.elements = elements;
  return container;
}

module.exports = {
  list,
  get,
  getContainer,
  getExam,
  getAssessments
};
