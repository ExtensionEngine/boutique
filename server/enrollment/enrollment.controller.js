'use strict';

const { createError } = require('../common/errors');
const { Enrollment, User, Sequelize } = require('../common/database');
const HttpStatus = require('http-status');
const map = require('lodash/map');

const { CONFLICT } = HttpStatus;
const Op = Sequelize.Op;

const processOutput = model => ({ ...model.toJSON(), student: model.student.profile });

function list({ query: { programId, studentId, filter }, options }, res) {
  const cond = [];
  const include = [{ model: User.match(filter), as: 'student' }];
  if (programId) cond.push({ programId });
  if (studentId) cond.push({ studentId });
  const opts = { where: { [Op.and]: cond }, include, ...options };
  return Enrollment.findAndCountAll(opts).then(({ rows, count }) => {
    res.jsend.success({ items: map(rows, processOutput), total: count });
  });
}

async function create({ body }, res) {
  const { studentId, programId } = body;
  if (!Array.isArray(studentId)) {
    const [result] = await Enrollment.restoreOrCreate(studentId, programId);
    if (result.isRejected()) return createError(CONFLICT);
    const enrollment = await result.value().reload({ include: ['student'] });
    return res.jsend.success(enrollment);
  }
  const [students, enrollments] = await bulkCreate(studentId, programId);
  const failed = students.map(it => ({
    programId,
    studentId: it.id,
    student: it.profile
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

async function bulkCreate(studentIds, programId, options = {}) {
  const enrollmentIds = [];
  const failedStudentIds = [];
  const results = await Enrollment.restoreOrCreate(studentIds, programId, options);
  results.forEach((it, index) => {
    if (it.isRejected()) return failedStudentIds.push(studentIds[index]);
    enrollmentIds.push(it.value().id);
  });
  return Promise.all([
    User.findAll({ where: { id: failedStudentIds } }),
    Enrollment.findAll({ where: { id: enrollmentIds }, include: ['student'] })
  ]);
}
