'use strict';

exports.add = (UserGroup, Hooks) => {
  UserGroup.addHook(Hooks.afterUpdate, userGroup => {
    const isRestored = userGroup.changed('deletedAt') && !userGroup.deletedAt;
    if (!isRestored) return;
    const where = { parentId: userGroup.id };
    return UserGroup.update({ deletedAt: null }, { where, paranoid: false });
  });

  UserGroup.addHook(Hooks.afterDestroy, userGroup => {
    const where = { parentId: userGroup.id };
    return UserGroup.destroy({ where });
  });
};
