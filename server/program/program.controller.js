'use strict';

const { Enrollment, Program, sequelize, Sequelize } = require('../common/database');
const pick = require('lodash/pick');

const processInput = input => pick(input, ['name', 'startDate', 'endDate']);

function list(req, res) {
  return Program.findAll().then(programs => res.jsend.success(programs));
}

function get({ program }, res) {
  return res.jsend.success(program);
}

function create({ body }, res) {
  return Program.create(processInput(body))
    .then(program => res.jsend.success(program));
}

function patch({ body, program }, res) {
  return program.update(processInput(body))
    .then(program => res.jsend.success(program));
}

function destroy({ program }, res) {
  sequelize.transaction(async transaction => {
    await Enrollment.destroy({ where: { programId: program.id }, transaction });
    return res.jsend.success(await program.destroy({ transaction }));
  });
}

function getEnrolledPrograms({ user }, res) {
  const currentDate = new Date();
  const { eq, gt, lt, or } = Sequelize.Op;
  const include = [{ model: Enrollment, where: { studentId: user.id } }];
  const startDate = { [or]: { [lt]: currentDate, [eq]: null } };
  const endDate = { [or]: { [gt]: currentDate, [eq]: null } };

  return Program.findAll({ include, where: { startDate, endDate } })
    .then(programs => res.jsend.success(programs));
}

module.exports = {
  list,
  get,
  create,
  patch,
  destroy,
  getEnrolledPrograms
};
