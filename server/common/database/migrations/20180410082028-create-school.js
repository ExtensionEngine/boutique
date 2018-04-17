'use strict';

const { enums: { level, status, type } } = require('../../../school/enums');
const tableName = 'school';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(tableName, {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    district_id: {
      type: Sequelize.INTEGER,
      references: { model: 'district', key: 'id' },
      allowNull: false
    },
    name: {
      type: Sequelize.STRING
    },
    level: {
      type: Sequelize.ENUM(level)
    },
    status: {
      type: Sequelize.ENUM(status)
    },
    type: {
      type: Sequelize.ENUM(type)
    },
    state: {
      type: Sequelize.STRING(2)
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false
    },
    deleted_at: {
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable(tableName)
};
