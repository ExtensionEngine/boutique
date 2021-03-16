'use strict';

const { Enrollment, Sequelize, User } = require('../common/database');
const { createError } = require('../common/errors');
const HttpStatus = require('http-status');
const map = require('lodash/map');

const { CONFLICT, NO_CONTENT } = HttpStatus;
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
    const [err, enrollment] = await Enrollment.restoreOrCreate({ learnerId, programId });
    if (err) return createError(CONFLICT, 'Enrollment exists!');
    await enrollment.reload({ include: ['learner'] });
    return res.jsend.success(enrollment);
  }
  const data = learnerId.map(id => ({ learnerId: id, programId }));
  const [learners, enrollments] = await bulkCreate(data);
  const failed = learners.map(it => ({
    programId,
    learnerId: it.id,
    learner: it.profile
  }));
  const created = map(enrollments, processOutput);
  res.jsend.success({ failed, created });
}

async function destroy({ params }, res) {
  const where = { id: params.id };
  await Enrollment.destroy({ where });
  res.sendStatus(NO_CONTENT);
}

module.exports = {
  list,
  create,
  destroy
};

async function bulkCreate(enrollments, { concurrency = 16, ...options } = {}) {
  const enrollmentIds = [];
  const failedLearnerIds = [];
  await Enrollment.restoreOrCreateAll(enrollments, { concurrency })
    .map(([err, enrollment], index) => {
      if (err) return failedLearnerIds.push(enrollments[index].learnerId);
      return enrollmentIds.push(enrollment.id);
    }, { concurrency });
  return Promise.all([
    User.findAll({ where: { id: failedLearnerIds } }),
    Enrollment.findAll({ where: { id: enrollmentIds }, include: ['learner'] })
  ]);
}
