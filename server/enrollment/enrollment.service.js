'use strict';

const db = require('../common/database');
const flatMap = require('lodash/flatMap');

const { Enrollment, OfferingUserGroup, User, UserGroup, sequelize } = db;

class EnrollmentService {
  async enrollMembership(membership, previousDeletedAt) {
    const transaction = await sequelize.transaction();
    const isRestored = previousDeletedAt && !membership.deletedAt;
    if (isRestored) return this.restoreEnrollments(membership, transaction);
    const { userId, userGroupId } = membership;
    const options = { where: { userGroupId }, transaction };
    const enrollments = await OfferingUserGroup.findAll(options)
      .map(({ offeringId }) => ({ learnerId: userId, offeringId }));
    await Enrollment.bulkCreate(enrollments, { transaction });
    return transaction.commit();
  }

  async unenrollMembership(membership) {
    const { userId, userGroupId } = membership;
    const transaction = await sequelize.transaction();
    const offeringIds = await this.getOfferingIds(userGroupId, transaction);
    const where = { learnerId: userId, enrollmentOfferingId: offeringIds };
    await Enrollment.destroy({ where, transaction });
    return transaction.commit();
  }

  async enrollUserGroup(userGroup, previousDeletedAt) {
    const isRestored = previousDeletedAt && !userGroup.deletedAt;
    if (!isRestored) return;
    const transaction = await sequelize.transaction();
    const where = { parentId: userGroup.id };
    const userGroupOptions = { where, paranoid: false, transaction };
    await UserGroup.update({ deletedAt: null }, userGroupOptions);
    const memberIds = await this.getMemberIds(userGroup, transaction);
    const options = { where: { learnerId: memberIds }, paranoid: false, transaction };
    await Enrollment.update({ deletedAt: null }, options);
    return transaction.commit();
  }

  async unenrollUserGroup(userGroup) {
    const where = { parentId: userGroup.id };
    const transaction = await sequelize.transaction();
    await UserGroup.destroy({ where, transaction });
    const memberIds = await this.getMemberIds(userGroup, transaction);
    const options = { where: { learnerId: memberIds }, transaction };
    await Enrollment.destroy(options);
    return transaction.commit();
  }

  async unenrollOfferingGroup(offeringUserGroup) {
    const include = [{ model: User, as: 'members', attributes: ['id'] }];
    const userGroup = await offeringUserGroup.getUserGroup({ include });
    const descendants = await userGroup.getDescendants();
    const userGroups = [userGroup, ...descendants];
    const memberIds = flatMap(userGroups, 'members').map(it => it.id);
    const { offeringId } = offeringUserGroup;
    const where = { learnerId: memberIds, enrollmentOfferingId: offeringId };
    return Enrollment.destroy({ where });
  }

  async restoreEnrollments(membership, transaction) {
    const { userId, userGroupId } = membership;
    const offeringIds = await this.getOfferingIds(userGroupId, transaction);
    const where = { learnerId: userId, enrollmentOfferingId: offeringIds };
    const options = { where, transaction, paranoid: false };
    return Enrollment.update({ deletedAt: null }, options);
  }

  getOfferingIds(userGroupId, transaction) {
    const opts = { where: { userGroupId }, transaction };
    return OfferingUserGroup.findAll(opts).map(({ offeringId }) => offeringId);
  }

  async getMemberIds(userGroup, transaction) {
    const members = await userGroup.getMembers({ transaction });
    return members.map(({ id }) => id);
  }
}

module.exports = new EnrollmentService();
