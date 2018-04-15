'use strict';

const { createError } = require('../common/errors');
const { Enrollment } = require('../common/database');
const HttpStatus = require('http-status');
const map = require('lodash/map');
const pick = require('lodash/pick');

const { BAD_REQUEST } = HttpStatus;

const processInput = input => pick(input, ['studentId', 'programLevelId']);
const processOutput = it => ({ ...it.dataValues, student: it.student.profile });

function list({ params: { programLevelId } }, res) {
  const where = {};
  if (programLevelId) where.programLevelId = programLevelId;
  return Enrollment.findAll({ where, include: ['student'] })
    .then(enrollments => res.jsend.success(map(enrollments, processOutput)));
}

function create({ body }, res) {
  const data = processInput(body);
  return Enrollment.findOne({ where: data })
    .then(existing => existing && createError(BAD_REQUEST, 'Enrollment exists!'))
    .then(() => Enrollment.create(data))
    .then(({ id }) => Enrollment.findById(id, { include: ['student'] }))
    .then(enrollment => res.jsend.success(processOutput(enrollment)));
}

module.exports = {
  list,
  create
};
