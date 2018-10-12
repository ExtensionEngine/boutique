'use strict';

const { createError } = require('../common/errors');
const { Enrollment, Program } = require('../common/database');
const HttpStatus = require('http-status');
const pick = require('lodash/pick');

const { NOT_FOUND } = HttpStatus;

const processInput = input => pick(input, ['name', 'startDate', 'endDate']);

function list(req, res) {
  return Program.findAll().then(programs => res.jsend.success(programs));
}

function get({ program }, res) {
  return res.jsend.success(program);
}

function create({ body }, res) {
  return Program.create(processInput(body))
    .then(program => res.jsend.success(program));
}

function patch({ body, program }, res) {
  return program.update(processInput(body))
    .then(program => res.jsend.success(program));
}

function destroy({ params: { id } }, res) {
  return Program.findById(id)
    .then(program => program || createError(NOT_FOUND))
    .then(program => program.destroy())
    .then(program => res.jsend.success(program));
}

function getEnrolledPrograms({ user }, res) {
  const include = [{ model: Enrollment, where: { studentId: user.id } }];
  return Program.findAll({ include })
    .then(programs => res.jsend.success(programs));
}

module.exports = {
  list,
  get,
  create,
  patch,
  destroy,
  getEnrolledPrograms
};
