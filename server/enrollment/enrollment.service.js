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

class EnrollmentService {
  async enrollUserGroup(userGroup, previousDeletedAt) {
    const isRestored = previousDeletedAt && !userGroup.deletedAt;
    if (!isRestored) return;
    const transaction = await sequelize.transaction();
    const opts = { transaction, paranoid: false };
    const descendantIds = await userGroup.getDescendants(opts).map(it => it.id);
    const userGroupWhere = { id: [userGroup.id, ...descendantIds] };
    await UserGroup.update({ deletedAt: null }, { where: userGroupWhere, ...opts });
    const members = await this.getLinkedMembers({ userGroup }, opts);
    const where = { learnerId: map(members, 'id') };
    await Enrollment.update({ deletedAt: null }, { where, ...opts });
    return transaction.commit();
  }

  async unenrollUserGroup(userGroup) {
    const transaction = await sequelize.transaction();
    const options = { paranoid: false, transaction };
    const members = await this.getLinkedMembers({ userGroup }, options);
    const where = { learnerId: map(members, 'id') };
    await Enrollment.destroy({ where, transaction });
    return transaction.commit();
  }

  async enrollOfferingGroup(offeringUserGroup) {
    const transaction = await sequelize.transaction();
    const { offeringId } = offeringUserGroup;
    const members = await this.getLinkedMembers({ offeringUserGroup }, { transaction });
    const enrollments = members.map(it => ({ learnerId: it.id, offeringId }));
    const opts = { modelSearchKey: ['learnerId', 'offeringId'], transaction };
    await Enrollment.restoreOrCreateAll(enrollments, opts);
    return transaction.commit();
  }

  async unenrollOfferingGroup(offeringUserGroup) {
    const transaction = await sequelize.transaction();
    const { offeringId } = offeringUserGroup;
    const options = { paranoid: false, transaction };
    const members = await this.getLinkedMembers({ offeringUserGroup }, options);
    const memberIds = map(members, 'id');
    const opts = { memberIds, transaction };
    const excludedUserIds = await this.getExcludedUserIds(offeringUserGroup, opts);
    const learnerIds = difference(memberIds, excludedUserIds);
    const where = { learnerId: learnerIds, enrollmentOfferingId: offeringId };
    await Enrollment.destroy({ where, transaction });
    return transaction.commit();
  }

  async enrollMembership(membership) {
    const transaction = await sequelize.transaction();
    const { userId, userGroupId } = membership;
    const options = { where: { userGroupId }, transaction };
    const enrollments = await OfferingUserGroup.findAll(options)
      .map(({ offeringId }) => ({ learnerId: userId, offeringId }));
    const opts = { modelSearchKey: ['learnerId', 'offeringId'], transaction };
    await Enrollment.restoreOrCreateAll(enrollments, opts);
    return transaction.commit();
  }

  async unenrollMembership(membership) {
    const { userId, userGroupId } = membership;
    const transaction = await sequelize.transaction();
    const offeringIds = await this.getOfferingIds(userGroupId, transaction);
    const where = { learnerId: userId, enrollmentOfferingId: offeringIds };
    await Enrollment.destroy({ where, transaction }); // check this
    return transaction.commit();
  }

  async getExcludedUserIds(offeringUserGroup, { memberIds, transaction }) {
    const { offeringId, userGroupId } = offeringUserGroup;
    const offeringGroupWhere = { offeringId, [Op.not]: { userGroupId } };
    const opts = { where: offeringGroupWhere, attributes: ['userGroupId'], transaction };
    const userGroupIds = await OfferingUserGroup.findAll(opts).map(it => it.userGroupId);
    const where = { userId: memberIds, userGroupId: userGroupIds };
    const options = { where, attributes: ['userId'], transaction };
    return UserGroupMembership.findAll(options).map(it => it.userId);
  }

  getOfferingIds(userGroupId, transaction) {
    const opts = { where: { userGroupId }, transaction };
    return OfferingUserGroup.findAll(opts).map(it => it.offeringId);
  }

  async getLinkedMembers({ userGroup, offeringUserGroup }, options) {
    const include = [{ model: User, as: 'members', attributes: ['id'] }];
    if (userGroup) await userGroup.reload({ include, ...options });
    else userGroup = await offeringUserGroup.getUserGroup({ include, ...options });
    const descendants = await userGroup.getDescendants(options);
    return flatMap([userGroup, ...descendants], 'members');
  }
}

module.exports = new EnrollmentService();
