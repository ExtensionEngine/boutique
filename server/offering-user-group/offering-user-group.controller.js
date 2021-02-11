'use strict';

const { CONFLICT, NO_CONTENT } = require('http-status');
const { OfferingUserGroup, Sequelize, UserGroup } = require('../common/database');
const { createError } = require('../common/errors');
const yn = require('yn');

const { Op } = Sequelize;

async function list({ offering, query, options }, res) {
  const { filter, archived } = query;
  const where = { enrollmentOfferingId: offering.id };
  const include = { model: UserGroup, where: {}, attributes: ['id', 'name'] };
  if (filter) include.where.name = { [Op.iLike]: `%${filter.trim()}%` };
  const opts = { ...options, where, include, paranoid: !yn(archived) };
  const { rows, count } = await OfferingUserGroup.findAndCountAll(opts);
  return res.jsend.success({ items: rows, total: count });
}

async function create({ offering, body }, res) {
  const { userGroupId } = body;
  const payload = { userGroupId, enrollmentOfferingId: offering.id };
  const [err, userGroup] = await OfferingUserGroup.restoreOrCreate(payload);
  if (err) return createError(CONFLICT, 'Offering user group exists!');
  return res.jsend.success(userGroup);
}

async function remove({ offeringUserGroup }, res) {
  await offeringUserGroup.destroy();
  return res.sendStatus(NO_CONTENT);
}

module.exports = {
  list,
  create,
  remove
};
