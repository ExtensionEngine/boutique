'use strict';

const { alterEnum } = require('../helpers');

const ROLES = {
  new: ['ADMIN', 'USER'],
  old: ['ADMIN', 'LEARNER']
};

const getOptions = (roles, ENUM) => ({
  table: 'user',
  column: 'role',
  type: ENUM(roles),
  allowNull: false
});

module.exports.up = (qi, { ENUM }) => alterEnum(qi, getOptions(ROLES.new, ENUM));

module.exports.down = (qi, { ENUM }) => alterEnum(qi, getOptions(ROLES.old, ENUM));
