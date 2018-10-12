'use strict';

const { timestamps } = require('../mixins');
const TABLE_NAME = 'content_repo';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(TABLE_NAME, {
    ...timestamps(Sequelize),
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    programId: {
      type: Sequelize.INTEGER,
      field: 'program_id',
      references: { model: 'program', key: 'id' },
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
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable(TABLE_NAME)
};
