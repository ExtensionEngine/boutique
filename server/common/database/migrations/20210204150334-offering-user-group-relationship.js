'use strict';

const TABLE_NAME = 'offering_user_group';

exports.up = (qi, { DATE, INTEGER }) => qi.createTable(TABLE_NAME, {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  userGroupId: {
    type: INTEGER,
    field: 'user_group_id',
    references: { model: 'user_group', key: 'id' },
    allowNull: false
  },
  enrollmentOfferingId: {
    type: INTEGER,
    field: 'enrollment_offering_id',
    references: { model: 'enrollment_offering', key: 'id' },
    allowNull: false
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
