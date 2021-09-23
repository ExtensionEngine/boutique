'use strict';

const { CONFLICT, NO_CONTENT } = require('http-status');
const { createError } = require('../common/errors');
const db = require('../common/database');
const enrollmentService = require('../enrollment/enrollment.service');

const { OfferingUserGroup, sequelize, Sequelize, UserGroup } = db;
const { Op } = Sequelize;

async function list({ offering, query, options }, res) {
  const { filter } = query;
  const where = { offeringId: offering.id };
  const include = { model: UserGroup, where: {}, attributes: ['id', 'name'] };
  if (filter) include.where.name = { [Op.iLike]: `%${filter.trim()}%` };
  const opts = { ...options, where, include };
  const { rows, count } = await OfferingUserGroup.findAndCountAll(opts);
  return res.jsend.success({ items: rows, total: count });
}

async function create({ offering, body }, res) {
  const { userGroupId } = body;
  const payload = { userGroupId, offeringId: offering.id };
  return sequelize.transaction(async transaction => {
    const opts = { modelSearchKey: ['offeringId', 'userGroupId'], transaction };
    const [err, userGroup] = await OfferingUserGroup.restoreOrCreate(payload, opts);
    if (err) return createError(CONFLICT, 'Offering user group exists!');
    await enrollmentService.enrollOfferingGroup(userGroup, { transaction });
    return userGroup;
  })
  .then(res.jsend.success);
}

function remove({ offeringUserGroup }, res) {
  return sequelize.transaction(async transaction => {
    await offeringUserGroup.destroy({ transaction });
    return enrollmentService.unenrollOfferingGroup(offeringUserGroup, { transaction });
  })
  .then(() => res.sendStatus(NO_CONTENT));
}

module.exports = {
  list,
  create,
  remove
};
