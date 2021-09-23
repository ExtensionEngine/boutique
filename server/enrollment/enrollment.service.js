'use strict';

const db = require('../common/database');
const difference = require('lodash/difference');
const flatMap = require('lodash/flatMap');
const map = require('lodash/map');

const {
  Enrollment,
  OfferingUserGroup,
  Sequelize,
  User,
  UserGroup,
  UserGroupMembership
} = db;

const { Op } = Sequelize;

async function enrollUserGroup(userGroup, previousDeletedAt, { transaction }) {
  const isRestored = previousDeletedAt && !userGroup.deletedAt;
  if (!isRestored) return;
  const opts = { transaction, paranoid: false };
  const rootWithdescendants = await userGroup.getRootWithDescendants(opts);
  const userGroupWhere = { id: map(rootWithdescendants, 'id') };
  await UserGroup.update({ deletedAt: null }, { where: userGroupWhere, ...opts });
  const members = await getLinkedMembers({ userGroup }, opts);
  const where = { learnerId: map(members, 'id') };
  return Enrollment.update({ deletedAt: null }, { where, ...opts });
}

async function unenrollUserGroup(userGroup, { transaction }) {
  const options = { paranoid: false, transaction };
  const members = await getLinkedMembers({ userGroup }, options);
  const where = { learnerId: map(members, 'id') };
  return Enrollment.destroy({ where, transaction });
}

async function enrollOfferingGroup(offeringUserGroup, { transaction }) {
  const { offeringId } = offeringUserGroup;
  const members = await getLinkedMembers({ offeringUserGroup }, { transaction });
  const enrollments = members.map(it => ({ learnerId: it.id, offeringId }));
  const opts = { modelSearchKey: ['learnerId', 'offeringId'], transaction };
  return Enrollment.restoreOrCreateAll(enrollments, opts);
}

async function unenrollOfferingGroup(offeringUserGroup, { transaction }) {
  const { offeringId } = offeringUserGroup;
  const options = { paranoid: false, transaction };
  const members = await getLinkedMembers({ offeringUserGroup }, options);
  const memberIds = map(members, 'id');
  const opts = { memberIds, transaction };
  const excludedUserIds = await getExcludedUserIds(offeringUserGroup, opts);
  const learnerIds = difference(memberIds, excludedUserIds);
  const where = { learnerId: learnerIds, enrollmentOfferingId: offeringId };
  return Enrollment.destroy({ where, transaction });
}

async function enrollMembership(membership, { transaction }) {
  const { userId, userGroupId } = membership;
  const options = { where: { userGroupId }, transaction };
  const enrollments = await OfferingUserGroup.findAll(options)
    .map(({ offeringId }) => ({ learnerId: userId, offeringId }));
  const opts = { modelSearchKey: ['learnerId', 'offeringId'], transaction };
  return Enrollment.restoreOrCreateAll(enrollments, opts);
}

async function unenrollMembership(membership, { transaction }) {
  const { userId, userGroupId } = membership;
  const opts = { where: { userGroupId }, transaction };
  const offeringIds = await OfferingUserGroup.findAll(opts).map(it => it.offeringId);
  const where = { learnerId: userId, enrollmentOfferingId: offeringIds };
  return Enrollment.destroy({ where, transaction });
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
  const rootWithdescendants = await userGroup.getRootWithDescendants(options);
  return flatMap(rootWithdescendants, 'members');
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
