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

function list({ query: { cohortId, studentId }, options }, res) {
  const cond = [];
  if (cohortId) cond.push({ cohortId });
  if (studentId) cond.push({ studentId });
  const opts = { where: { [Op.and]: cond }, include: ['student'], ...options };
  return Enrollment.findAndCountAll(opts).then(({ rows, count }) => {
    res.jsend.success({ items: map(rows, processOutput), total: count });
  });
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
