'use strict';

const flatMap = require('lodash/flatMap');

exports.add = (OfferingUserGroup, Hooks, db) => {
  const { Enrollment, User } = db;

  OfferingUserGroup.addHook(Hooks.afterCreate, async offeringUserGroup => {
  });

  OfferingUserGroup.addHook(Hooks.afterDestroy, async offeringUserGroup => {
    const include = [{ model: User, as: 'members', attributes: ['id'] }];
    const userGroup = await offeringUserGroup.getUserGroup({ include });
    const descendants = await userGroup.getDescendants();
    const userGroups = [userGroup, ...descendants];
    const memberIds = flatMap(userGroups, 'members').map(it => it.id);
    const { offeringId } = offeringUserGroup;
    const where = { learnerId: memberIds, enrollmentOfferingId: offeringId };
    return Enrollment.destroy({ where });
  });
};
