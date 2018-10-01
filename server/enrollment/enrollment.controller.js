'use strict';

const { createError } = require('../common/errors');
const { Enrollment, Sequelize } = require('../common/database');
const HttpStatus = require('http-status');
const map = require('lodash/map');
const pick = require('lodash/pick');

const { BAD_REQUEST } = HttpStatus;
const Op = Sequelize.Op;

const processInput = input => pick(input, ['studentId', 'cohortId']);
const processOutput = it => ({ ...it.dataValues, student: it.student.profile });

function list({ query: { cohortId, studentId } }, res) {
  const cond = [];
  if (cohortId) cond.push({ cohortId });
  if (studentId) cond.push({ studentId });
  return Enrollment.findAll({ where: { [Op.and]: cond }, include: ['student'] })
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

function listUserEnrollments({ user }, res) {
  const opts = { where: { studentId: user.id }, include: ['cohort'] };
  return Enrollment.findAll(opts)
    .then(enrollments => res.jsend.success(enrollments));
}

module.exports = {
  list,
  create,
  listUserEnrollments
};
