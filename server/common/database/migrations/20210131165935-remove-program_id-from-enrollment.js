'use strict';

const TABLE_NAME = 'enrollment';
const COLUMN_NAME = 'program_id';

exports.up = qi => qi.removeColumn(TABLE_NAME, COLUMN_NAME);

exports.down = (qi, Sequelize) => qi.addColumn(TABLE_NAME, COLUMN_NAME, {
  type: Sequelize.INTEGER,
  references: { model: 'program', key: 'id' }
});
