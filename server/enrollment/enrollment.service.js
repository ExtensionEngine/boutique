'use strict';

const db = require('../common/database');
const difference = require('lodash/difference');
const flatMap = require('lodash/flatMap');
const map = require('lodash/map');

const {
  Enrollment,
  OfferingUserGroup,
  User,
  UserGroup,
  UserGroupMembership,
  Sequelize,
  sequelize
} = db;

const { Op } = Sequelize;

async function enrollUserGroup(userGroup, previousDeletedAt) {
  const isRestored = previousDeletedAt && !userGroup.deletedAt;
  if (!isRestored) return;
  const transaction = await sequelize.transaction();
  const opts = { transaction, paranoid: false };
  const descendantIds = await userGroup.getDescendants(opts).map(it => it.id);
  const userGroupWhere = { id: [userGroup.id, ...descendantIds] };
  await UserGroup.update({ deletedAt: null }, { where: userGroupWhere, ...opts });
  const members = await getLinkedMembers({ userGroup }, opts);
  const where = { learnerId: map(members, 'id') };
  await Enrollment.update({ deletedAt: null }, { where, ...opts });
  return transaction.commit();
}

async function unenrollUserGroup(userGroup) {
  const transaction = await sequelize.transaction();
  const options = { paranoid: false, transaction };
  const members = await getLinkedMembers({ userGroup }, options);
  const where = { learnerId: map(members, 'id') };
  await Enrollment.destroy({ where, transaction });
  return transaction.commit();
}

async function enrollOfferingGroup(offeringUserGroup) {
  const transaction = await sequelize.transaction();
  const { offeringId } = offeringUserGroup;
  const members = await getLinkedMembers({ offeringUserGroup }, { transaction });
  const enrollments = members.map(it => ({ learnerId: it.id, offeringId }));
  const opts = { modelSearchKey: ['learnerId', 'offeringId'], transaction };
  await Enrollment.restoreOrCreateAll(enrollments, opts);
  return transaction.commit();
}

async function unenrollOfferingGroup(offeringUserGroup) {
  const transaction = await sequelize.transaction();
  const { offeringId } = offeringUserGroup;
  const options = { paranoid: false, transaction };
  const members = await getLinkedMembers({ offeringUserGroup }, options);
  const memberIds = map(members, 'id');
  const opts = { memberIds, transaction };
  const excludedUserIds = await getExcludedUserIds(offeringUserGroup, opts);
  const learnerIds = difference(memberIds, excludedUserIds);
  const where = { learnerId: learnerIds, enrollmentOfferingId: offeringId };
  await Enrollment.destroy({ where, transaction });
  return transaction.commit();
}

async function enrollMembership(membership) {
  const transaction = await sequelize.transaction();
  const { userId, userGroupId } = membership;
  const options = { where: { userGroupId }, transaction };
  const enrollments = await OfferingUserGroup.findAll(options)
    .map(({ offeringId }) => ({ learnerId: userId, offeringId }));
  const opts = { modelSearchKey: ['learnerId', 'offeringId'], transaction };
  await Enrollment.restoreOrCreateAll(enrollments, opts);
  return transaction.commit();
}

async function unenrollMembership(membership) {
  const { userId, userGroupId } = membership;
  const transaction = await sequelize.transaction();
  const offeringIds = await getOfferingIds(userGroupId, transaction);
  const where = { learnerId: userId, enrollmentOfferingId: offeringIds };
  await Enrollment.destroy({ where, transaction });
  return transaction.commit();
}

module.exports = {
  enrollUserGroup,
  enrollOfferingGroup,
  enrollMembership,
  unenrollUserGroup,
  unenrollOfferingGroup,
  unenrollMembership
};

async function getLinkedMembers({ userGroup, offeringUserGroup }, options) {
  const include = [{ model: User, as: 'members', attributes: ['id'] }];
  if (userGroup) await userGroup.reload({ include, ...options });
  else userGroup = await offeringUserGroup.getUserGroup({ include, ...options });
  const descendants = await userGroup.getDescendants(options);
  return flatMap([userGroup, ...descendants], 'members');
}

function getOfferingIds(userGroupId, transaction) {
  const opts = { where: { userGroupId }, transaction };
  return OfferingUserGroup.findAll(opts).map(it => it.offeringId);
}

async function getExcludedUserIds(offeringUserGroup, { memberIds, transaction }) {
  const { offeringId, userGroupId } = offeringUserGroup;
  const offeringGroupWhere = { offeringId, [Op.not]: { userGroupId } };
  const opts = { where: offeringGroupWhere, attributes: ['userGroupId'], transaction };
  const userGroupIds = await OfferingUserGroup.findAll(opts).map(it => it.userGroupId);
  const where = { userId: memberIds, userGroupId: userGroupIds };
  const options = { where, attributes: ['userId'], transaction };
  return UserGroupMembership.findAll(options).map(it => it.userId);
}
