'use strict';

const { createError } = require('../common/errors');
const { Enrollment, User, Sequelize } = require('../common/database');
const HttpStatus = require('http-status');
const map = require('lodash/map');

const { CONFLICT, NO_CONTENT } = HttpStatus;
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
    const [err, enrollment] = await Enrollment.restoreOrCreate({ studentId, programId });
    if (err) return createError(CONFLICT, 'Enrollment exists!');
    await enrollment.reload({ include: ['student'] });
    return res.jsend.success(enrollment);
  }
  const data = studentId.map(id => ({ studentId: id, programId }));
  const [students, enrollments] = await bulkCreate(data);
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
    .then(() => res.sendStatus(NO_CONTENT));
}

module.exports = {
  list,
  create,
  destroy
};

async function bulkCreate(enrollments, { concurrency = 16, ...options } = {}) {
  const enrollmentIds = [];
  const failedStudentIds = [];
  await Enrollment.restoreOrCreateAll(enrollments, { concurrency })
    .map(([err, enrollment], index) => {
      if (err) return failedStudentIds.push(enrollments[index].studentId);
      enrollmentIds.push(enrollment.id);
    }, { concurrency });
  return Promise.all([
    User.findAll({ where: { id: failedStudentIds } }),
    Enrollment.findAll({ where: { id: enrollmentIds }, include: ['student'] })
  ]);
}
