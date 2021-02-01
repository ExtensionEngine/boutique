'use strict';

const { Role } = require('../../../../common/config');

const TABLE_NAME = 'user_group_members';

exports.up = (qi, { DATE, ENUM, INTEGER }) => qi.createTable(TABLE_NAME, {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  userId: {
    type: INTEGER,
    field: 'user_id',
    references: { model: 'user', key: 'id' },
    allowNull: false
  },
  userGroupId: {
    type: INTEGER,
    field: 'user_group_id',
    references: { model: 'user_group', key: 'id' },
    allowNull: false
  },
  role: {
    type: ENUM(Object.values(Role))
  },
  createdAt: {
    type: DATE,
    field: 'created_at',
    allowNull: false
  },
  updatedAt: {
    type: DATE,
    field: 'updated_at',
    allowNull: false
  },
  deletedAt: {
    type: DATE,
    field: 'deleted_at'
  }
});

exports.down = qi => qi.dropTable(TABLE_NAME);
