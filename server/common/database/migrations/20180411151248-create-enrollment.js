'use strict';

const { timestamps } = require('../mixins');
const TABLE_NAME = 'enrollment';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(TABLE_NAME, {
    ...timestamps(Sequelize),
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    studentId: {
      type: Sequelize.INTEGER,
      field: 'student_id',
      references: { model: 'user', key: 'id' },
      onDelete: 'NO ACTION',
      allowNull: false
    },
    programId: {
      type: Sequelize.INTEGER,
      field: 'program_id',
      references: { model: 'program', key: 'id' },
      onDelete: 'NO ACTION',
      allowNull: false
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable(TABLE_NAME)
};
