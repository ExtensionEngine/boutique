'use strict';

const { Enrollment, Program, Sequelize, sequelize } = require('../common/database');
const pick = require('lodash/pick');
const yn = require('yn');

const { Op } = Sequelize;

const processInput = input => pick(input, ['name', 'startDate', 'endDate']);

function list({ query, options }, res) {
  const { name, filter, deleted } = query;
  const where = {};
  if (filter) where.name = { [Op.iLike]: `%${filter.trim()}%` };
  if (name) where.name = { [Op.iLike]: name.trim() };
  return Program.findAndCountAll({ where, ...options, paranoid: !yn(deleted) })
    .then(({ rows, count }) => res.jsend.success({ items: rows, total: count }));
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
  return sequelize.transaction(async transaction => {
    await Enrollment.destroy({ where: { programId: program.id }, transaction });
    return program.destroy({ transaction });
  })
  .then(program => res.jsend.success(program));
}

function getEnrolledPrograms({ user }, res) {
  const include = [{ model: Enrollment, where: { learnerId: user.id } }];
  return Program.active().findAll({ include })
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
