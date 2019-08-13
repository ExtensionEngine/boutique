'use strict';

const { createError } = require('../common/errors');
const HttpStatus = require('http-status');
const map = require('lodash/map');
const omit = require('lodash/omit');
const pick = require('lodash/pick');
const { delivery: contentProcessor } = require('./processor');

const { NOT_FOUND } = HttpStatus;
const excludeCorrect = data => map(data, it => omit(it, 'data.correct'));

function list({ program, query: { includeStructure } }, res) {
  const attributes = ['id', 'schema', 'name', 'description', 'publishedAt'];
  if (includeStructure) attributes.push('structure');
  return program.getContentRepos({ attributes })
    .then(repos => res.jsend.success(repos));
}

function get({ repo }, res) {
  const attributes = [
    'id', 'schema', 'name', 'description', 'structure', 'publishedAt'];
  return res.jsend.success(pick(repo, attributes));
}

function getContainer({ program, params, repo }, res) {
  return contentProcessor.getContainer(repo.sourceId, params.containerId, program.id)
    .catch(() => createError(NOT_FOUND, 'Not found!'))
    .then(container => res.jsend.success(container));
}

function getExam({ program, params, repo }, res) {
  return contentProcessor.getExam(repo.sourceId, params.examId, program.id)
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
  return contentProcessor.getAssessments(repo.sourceId, params.assessmentsId, program.id)
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
