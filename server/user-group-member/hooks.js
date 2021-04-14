'use strict';

exports.add = (UserGroupMember, Hooks, db) => {
  const { Enrollment, OfferingUserGroup } = db;

  UserGroupMember.addHook(Hooks.afterCreate, async member => {
    const { userId: learnerId, userGroupId } = member;
    const where = { userGroupId };
    const enrollments = await OfferingUserGroup.findAll({ where })
      .map(({ offeringId }) => ({ learnerId, offeringId }));
    return Enrollment.bulkCreate(enrollments);
  });

  UserGroupMember.addHook(Hooks.afterUpdate, async member => {
    const isRestored = member.changed('deletedAt') && !member.deletedAt;
    if (isRestored) return restoreEnrollments(member, db);
    const isUserChanged = member.changed('userId');
    if (!isUserChanged) return;
    const { userId: oldLearnerId } = member._previousDataValues;
    const { userId: learnerId, userGroupId } = member;
    const offeringIds = await OfferingUserGroup.findAll({ where: { userGroupId } })
      .map(({ offeringId }) => offeringId);
    const where = { learnerId: oldLearnerId, enrollmentOfferingId: offeringIds };
    return Enrollment.update({ learnerId }, { where });
  });

  UserGroupMember.addHook(Hooks.afterDestroy, async member => {
    const { userId: learnerId, userGroupId } = member;
    const offeringIds = await OfferingUserGroup.findAll({ where: { userGroupId } })
      .map(({ offeringId }) => offeringId);
    const where = { learnerId, enrollmentOfferingId: offeringIds };
    return Enrollment.destroy({ where });
  });

  async function restoreEnrollments({ userId, userGroupId }) {
    const offeringIds = await OfferingUserGroup.findAll({ where: { userGroupId } })
      .map(({ offeringId }) => offeringId);
    const where = { learnerId: userId, enrollmentOfferingId: offeringIds };
    return Enrollment.update({ deletedAt: null }, { where, paranoid: false });
  }
};
