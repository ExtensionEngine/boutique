'use strict';

const TABLE_NAME = 'enrollment_offering';

exports.up = (queryInterface, Sequelize) => queryInterface.createTable(TABLE_NAME, {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  repositoryId: {
    type: Sequelize.INTEGER,
    field: 'repository_id',
    references: { model: 'content_repo', key: 'id' }
  },
  programId: {
    type: Sequelize.INTEGER,
    field: 'program_id',
    references: { model: 'program', key: 'id' }
  },
  createdAt: {
    type: Sequelize.DATE,
    field: 'created_at',
    allowNull: false
  },
  updatedAt: {
    type: Sequelize.DATE,
    field: 'updated_at',
    allowNull: false
  },
  deletedAt: {
    type: Sequelize.DATE,
    field: 'deleted_at'
  }
});

exports.down = queryInterface => queryInterface.dropTable(TABLE_NAME);
