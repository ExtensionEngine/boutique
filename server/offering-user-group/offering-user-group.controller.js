'use strict';

const { CONFLICT, NO_CONTENT } = require('http-status');
const { OfferingUserGroup, Sequelize } = require('../common/database');
const { createError } = require('../common/errors');
const yn = require('yn');

const { Op } = Sequelize;

function list({ offering, query, options }, res) {
  const { filter, archived } = query;
  const where = { enrollmentOfferingId: offering.id };
  if (filter) where.name = { [Op.iLike]: `%${filter.trim()}%` };
  Object.assign(options, { where, paranoid: !yn(archived) });
  return OfferingUserGroup.findAndCountAll(options)
    .then(({ rows, count }) => res.jsend.success({ items: rows, total: count }));
}

async function create({ offering, body }, res) {
  const { id } = body;
  const payload = { id, enrollmentOfferingId: offering.id };
  const [err, userGroup] = await OfferingUserGroup.restoreOrCreate(payload);
  if (err) return createError(CONFLICT, 'Offering user group exists!');
  return res.jsend.success(userGroup);
}

async function remove({ offeringUserGroup }, res) {
  return offeringUserGroup.destroy().then(() => res.sendStatus(NO_CONTENT));
}

module.exports = {
  list,
  create,
  remove
};
