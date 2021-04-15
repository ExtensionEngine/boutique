'use strict';

exports.add = (UserGroupMembership, Hooks, db) => {
  const { Enrollment, OfferingUserGroup } = db;

  UserGroupMembership.addHook(Hooks.afterCreate, async membership => {
    const { userId, userGroupId } = membership;
    const where = { userGroupId };
    const enrollments = await OfferingUserGroup.findAll({ where })
      .map(({ offeringId }) => ({ learnerId: userId, offeringId }));
    return Enrollment.bulkCreate(enrollments);
  });

  UserGroupMembership.addHook(Hooks.afterUpdate, async membership => {
    const isRestored = membership.changed('deletedAt') && !membership.deletedAt;
    if (isRestored) return restoreEnrollments(membership, db);
  });

  UserGroupMembership.addHook(Hooks.afterDestroy, async membership => {
    const { userId, userGroupId } = membership;
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
