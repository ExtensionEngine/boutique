'use strict';

const { Enrollment, Sequelize, User } = require('../common/database');
const { createError } = require('../common/errors');
const HttpStatus = require('http-status');
const map = require('lodash/map');
const pick = require('lodash/pick');

const { BAD_REQUEST } = HttpStatus;
const Op = Sequelize.Op;

const processInput = input => pick(input, ['studentId', 'programId']);
const processOutput = it => ({ ...it.dataValues, student: it.student.profile });

const createFilter = q => map(['email', 'firstName', 'lastName'],
  it => ({ [it]: { [Op.iLike]: `%${q}%` } }));

function list({ query: { programId, studentId, filter }, options }, res) {
  const cond = [];
  const include = [{ model: User, as: 'student' }];
  if (filter) include[0].where = { [Op.or]: createFilter(filter) };
  if (programId) cond.push({ programId });
  if (studentId) cond.push({ studentId });
  const opts = { where: { [Op.and]: cond }, include, ...options };
  return Enrollment.findAndCountAll(opts).then(({ rows, count }) => {
    res.jsend.success({ items: map(rows, processOutput), total: count });
  });
}

function create({ body }, res) {
  const data = processInput(body);
  return Enrollment.findOne({ where: data, paranoid: false })
    .then(existing => {
      if (!existing) return Enrollment.create(data);
      if (!existing.deletedAt) createError(BAD_REQUEST, 'Enrollment exists!');
      existing.setDataValue('deletedAt', null);
      return existing.save();
    })
    .then(({ id }) => Enrollment.findById(id, { include: ['student'] }))
    .then(enrollment => res.jsend.success(processOutput(enrollment)));
}

function destroy({ params }, res) {
  return Enrollment.destroy({ where: { id: params.id } })
    .then(() => res.end());
}

module.exports = {
  list,
  create,
  destroy
};
