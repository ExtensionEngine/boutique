'use strict';

const { createError } = require('../common/errors');
const { Enrollment, Sequelize } = require('../common/database');
const find = require('lodash/find');
const HttpStatus = require('http-status');
const map = require('lodash/map');
const pick = require('lodash/pick');
const Promise = require('bluebird');

const { BAD_REQUEST } = HttpStatus;
const Op = Sequelize.Op;

const processInput = input => pick(input, ['studentId', 'programId']);
const processOutput = it => ({ ...it.dataValues, student: it.student.profile });

function list({ query: { programId, studentId }, options }, res) {
  const cond = [];
  if (programId) cond.push({ programId });
  if (studentId) cond.push({ studentId });
  const opts = { where: { [Op.and]: cond }, include: ['student'], ...options };
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

async function bulkEnroll({ body: { userIds, programId } }, res) {
  let errorCount = 0;
  const existingEnrollments = await Enrollment.findAll({
    where: { studentId: userIds, programId },
    paranoid: false
  });
  await Promise.each(userIds, studentId => {
    const existing = find(existingEnrollments, { studentId });
    if (!existing) return Enrollment.create({ studentId, programId });
    if (!existing.deletedAt) return (errorCount = errorCount + 1);
    existing.setDataValue('deletedAt', null);
    return existing.save();
  });
  return res.jsend.success({ errorCount });
}

function destroy({ params }, res) {
  return Enrollment.destroy({ where: { id: params.id } })
    .then(() => res.end());
}

module.exports = {
  list,
  create,
  bulkEnroll,
  destroy
};
