'use strict';

const TABLE_NAME = 'enrollment';
const COLUMN_NAME = 'enrollment_offering_id';

exports.up = (qi, Sequelize) => qi.addColumn(TABLE_NAME, COLUMN_NAME, {
  type: Sequelize.INTEGER,
  references: { model: 'enrollment_offering', key: 'id' }
});

exports.down = qi => qi.removeColumn(TABLE_NAME, COLUMN_NAME);
