'use strict';

exports.add = (UserGroup, Hooks, db) => {
  const { Enrollment } = db;

  UserGroup.addHook(Hooks.afterUpdate, async userGroup => {
    const isRestored = userGroup.changed('deletedAt') && !userGroup.deletedAt;
    if (!isRestored) return;
    const where = { parentId: userGroup.id };
    await UserGroup.update({ deletedAt: null }, { where, paranoid: false });
    const memberIds = await getMemberIds(userGroup);
    const options = { where: { learnerId: memberIds }, paranoid: false };
    return Enrollment.update({ deletedAt: null }, options);
  });

  UserGroup.addHook(Hooks.afterDestroy, async userGroup => {
    const where = { parentId: userGroup.id };
    await UserGroup.destroy({ where });
    const memberIds = await getMemberIds(userGroup);
    return Enrollment.destroy({ where: { learnerId: memberIds } });
  });

  async function getMemberIds(userGroup) {
    const members = await userGroup.getMembers();
    return members.map(({ id }) => id);
  }
};
