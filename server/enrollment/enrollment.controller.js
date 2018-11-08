'use strict';

const { Enrollment, Sequelize } = require('../common/database');
const { createError } = require('../common/errors');
const { bulkEnrollmentMessage } = require('../common/messages');
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

function bulkEnroll({ body }, res) {
  const { users, programId } = body;
  const enrollMessages = [];
  return Promise.each(users, user => {
    console.log('bbb... ' + user);
    let data = { studentId: user.id, programId: programId };
    return Enrollment.findOne({ where: data, paranoid: false })
      .then(existing => {
        if (!existing) {
          const message = bulkEnrollmentMessage(user.email, 'success', 'Enrollment created');
          enrollMessages.push(message);
          return Enrollment.create(data);
        }
        if (existing.deletedAt) {
          const message = bulkEnrollmentMessage(user.email, 'info', 'Enrollment recreated');
          enrollMessages.push(message);
          existing.setDataValue('deletedAt', null);
          return existing.save();
        } else {
          const message = bulkEnrollmentMessage(user.email, 'error', 'Enrollment exists');
          enrollMessages.push(message);
        }
      });
  })
  .then(() => res.jsend.success({ 'messages': enrollMessages }));
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
