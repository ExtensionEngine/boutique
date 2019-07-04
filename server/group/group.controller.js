'use strict';

const { Group, User, Sequelize } = require('../common/database');
const map = require('lodash/map');
const pick = require('lodash/pick');

const processInput = input => pick(input, ['name', 'description', 'startDate', 'endDate']);
const { Op } = Sequelize;
const inputAttrs = ['name', 'description'];

const createFilter = q => map(['name', 'description'],
  it => ({ [it]: { [Op.iLike]: `%${q}%` } }));

function list({ query: { filter, name, archived }, options }, res) {
  const where = {};
  if (filter) where[Op.or] = createFilter(filter);
  if (name) where[Op.and] = { name };
  return Group.findAndCountAll({
    where,
    ...options,
    paranoid: !archived,
    include: [{
      model: User, attributes: ['id']
    }]
  })
  .then(({ rows, count }) => {
    return res.jsend.success({ items: rows, total: count });
  });
}

function create({ body }, res) {
  return Group.restoreOrBuild(processInput(body))
    .then(result => res.jsend.success(result));
}

function patch({ body, group }, res) {
  return group.update(pick(body, inputAttrs))
    .then(group => res.jsend.success(group));
}

function destroy({ group }, res) {
  return group.destroy().then(() => res.end());
}

module.exports = {
  list,
  create,
  patch,
  destroy
};
