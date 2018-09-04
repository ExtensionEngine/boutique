'use strict';

const TABLE_NAME = 'course';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(TABLE_NAME, {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    programLevelId: {
      type: Sequelize.INTEGER,
      field: 'program_level_id',
      references: { model: 'program_level', key: 'id' },
      onDelete: 'NO ACTION',
      allowNull: false
    },
    sourceId: {
      field: 'source_id',
      type: Sequelize.INTEGER,
      allowNull: false
    },
    uid: {
      type: Sequelize.UUID,
      allowNull: false
    },
    schema: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(250),
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    structure: {
      type: Sequelize.JSONB,
      allowNull: false
    },
    publishedAt: {
      type: Sequelize.DATE,
      field: 'published_at',
      allowNull: false
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
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable(TABLE_NAME)
};
