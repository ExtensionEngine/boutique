'use strict';

const { Cohort } = require('../common/database');
const pick = require('lodash/pick');

const processInput = input => pick(input, ['name']);

function list(req, res) {
  return Cohort.findAll().then(cohorts => res.jsend.success(cohorts));
}

function get({ cohort }, res) {
  return res.jsend.success(cohort);
}

function create({ body }, res) {
  return Cohort.create(processInput(body))
    .then(cohort => res.jsend.success(cohort));
}

function patch({ body, cohort }, res) {
  return cohort.update(processInput(body))
    .then(cohort => res.jsend.success(cohort));
}

module.exports = {
  list,
  get,
  create,
  patch
};
