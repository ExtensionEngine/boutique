'use strict';

const { Enrollment, Sequelize } = require('../common/database');
const { createError } = require('../common/errors');
const HttpStatus = require('http-status');
const includes = require('lodash/includes');
const find = require('lodash/find');
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

function bulkEnroll({ body: { users, programId } }, res) {
  const userIds = map(users, 'id');
  return Enrollment.findAll({
    where: {
      studentId: userIds,
      programId
    },
    paranoid: false
  })
  .then(existingUsers => {
    let enrollMessage = { type: 'success', text: '' };
    let count = 0;

    return Promise.each(userIds, studentId => {
      const existingUser = find(existingUsers, { studentId });
      if (!existingUser) return Enrollment.create({ studentId, programId });
      if (existingUser.deletedAt) {
        existingUser.setDataValue('deletedAt', null);
        return existingUser.save();
      } else {
        count = count + 1;
        return count;
      }
    })
    .then(() => {
      if (count > 0) {
        enrollMessage = {
          type: 'info',
          text: `Enrolled failed for ${count} users`
        };
      }
      res.jsend.success({ 'message': enrollMessage });
    });
  });
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
