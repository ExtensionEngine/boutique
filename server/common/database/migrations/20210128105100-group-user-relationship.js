'use strict';

const { role: roles } = require('../../../../common/config');

const TABLE_NAME = 'group_user';

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
  groupId: {
    type: INTEGER,
    field: 'group_id',
    references: { model: 'group', key: 'id' },
    allowNull: false
  },
  role: {
    type: ENUM(Object.values(roles))
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
