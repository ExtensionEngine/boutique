'use strict';

exports.add = (UserGroupMember, Hooks, db) => {
  const { Enrollment, OfferingUserGroup } = db;

  UserGroupMember.addHook(Hooks.afterCreate, async member => {
    const { userId, userGroupId } = member;
    const where = { userGroupId };
    const enrollments = await OfferingUserGroup.findAll({ where })
      .map(({ offeringId }) => ({ learnerId: userId, offeringId }));
    return Enrollment.bulkCreate(enrollments);
  });

  UserGroupMember.addHook(Hooks.afterUpdate, async member => {
    const isRestored = member.changed('deletedAt') && !member.deletedAt;
    if (isRestored) return restoreEnrollments(member, db);
    const isUserChanged = member.changed('userId');
    if (!isUserChanged) return;
    const { userId, userGroupId, _previousDataValues } = member;
    const { userId: oldLUserId } = _previousDataValues;
    const offeringIds = await getOfferingIds(userGroupId);
    const where = { learnerId: oldLUserId, enrollmentOfferingId: offeringIds };
    return Enrollment.update({ learnerId: userId }, { where });
  });

  UserGroupMember.addHook(Hooks.afterDestroy, async member => {
    const { userId, userGroupId } = member;
    const offeringIds = await getOfferingIds(userGroupId);
    const where = { learnerId: userId, enrollmentOfferingId: offeringIds };
    return Enrollment.destroy({ where });
  });

  async function restoreEnrollments({ userId, userGroupId }) {
    const offeringIds = await getOfferingIds(userGroupId);
    const where = { learnerId: userId, enrollmentOfferingId: offeringIds };
    return Enrollment.update({ deletedAt: null }, { where, paranoid: false });
  }

  function getOfferingIds(userGroupId) {
    const opts = { where: { userGroupId } };
    return OfferingUserGroup.findAll(opts).map(({ offeringId }) => offeringId);
  }
};
