'use strict';

const { Enrollment, Sequelize, User } = require('../common/database');
const { createError } = require('../common/errors');
const HttpStatus = require('http-status');
const map = require('lodash/map');

const { CONFLICT } = HttpStatus;
const Op = Sequelize.Op;

const processOutput = model => ({ ...model.toJSON(), learner: model.learner.profile });

function list({ query: { programId, learnerId, filter }, options }, res) {
  const cond = [];
  const include = [{ model: User.match(filter), as: 'learner' }];
  if (programId) cond.push({ programId });
  if (learnerId) cond.push({ learnerId });
  const opts = { where: { [Op.and]: cond }, include, ...options };
  return Enrollment.findAndCountAll(opts).then(({ rows, count }) => {
    res.jsend.success({ items: map(rows, processOutput), total: count });
  });
}

async function create({ body }, res) {
  const { learnerId, programId } = body;
  if (!Array.isArray(learnerId)) {
    const [result] = await Enrollment.restoreOrCreate(learnerId, programId);
    if (result.isRejected()) return createError(CONFLICT);
    const enrollment = await result.value().reload({ include: ['learner'] });
    return res.jsend.success(enrollment);
  }
  const [learners, enrollments] = await bulkCreate(learnerId, programId);
  const failed = learners.map(it => ({
    programId,
    learnerId: it.id,
    learner: it.profile
  }));
  const created = map(enrollments, processOutput);
  res.jsend.success({ failed, created });
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

async function bulkCreate(learnerIds, programId, options = {}) {
  const enrollmentIds = [];
  const failedLearnerIds = [];
  const results = await Enrollment.restoreOrCreate(learnerIds, programId, options);
  results.forEach((it, index) => {
    if (it.isRejected()) return failedLearnerIds.push(learnerIds[index]);
    enrollmentIds.push(it.value().id);
  });
  return Promise.all([
    User.findAll({ where: { id: failedLearnerIds } }),
    Enrollment.findAll({ where: { id: enrollmentIds }, include: ['learner'] })
  ]);
}
