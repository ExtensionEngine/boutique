'use strict';

const TABLE_NAME = 'user_group_membership';

exports.up = (qi, { DATE, ENUM, INTEGER }) => qi.createTable(TABLE_NAME, {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true
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
    type: ENUM('INSTRUCTOR', 'LEARNER')
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
