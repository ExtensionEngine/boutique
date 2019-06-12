'use strict';

const { createError } = require('../common/errors');
const { Group, sequelize, Sequelize } = require('../common/database');
const pick = require('lodash/pick');
const map = require('lodash/map');
const { Op } = Sequelize;
const HttpStatus = require('http-status');
const { NOT_FOUND } = HttpStatus;
const processInput = input => pick(input, ['name', 'description', 'startDate', 'endDate']);

const inputAttrs = ['name', 'description'];

const createFilter = q => map(['name', 'description'],
  it => ({ [it]: { [Op.iLike]: `%${q}%` } }));

function list({ query: { filter, archived }, options }, res) {
  const where = { [Op.and]: [] };
  if (filter) where[Op.or] = createFilter(filter);
  return Group.findAndCountAll({ where, ...options, paranoid: !archived })
    .then(({ rows, count }) => {
      console.log('uso3');
      return res.jsend.success({ items: map(rows, 'profile'), total: count });
    });
}

function create({ body }, res) {
  return Group.create(processInput(body))
    .then(group => res.jsend.success(group));
}

function patch({ body, params }, res) {
  return Group.findById(params.id, { paranoid: false })
    .then(group => group || createError(NOT_FOUND, 'Group does not exist!'))
    .then(group => group.update(pick(body, inputAttrs)))
    .then(group => res.jsend.success(group.profile));
}

function destroy({ params }, res) {
  sequelize.transaction(async transaction => {
    const group = await Group.findById(params.id, { transaction });
    if (!group) createError(NOT_FOUND);
    await group.destroy({ transaction });
    res.end();
  });
}

module.exports = {
  list,
  create,
  patch,
  destroy
};
