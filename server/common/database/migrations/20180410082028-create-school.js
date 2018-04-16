'use strict';

const tableName = 'school';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(tableName, {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
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
    nces_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true
    },
    nces_school_level: {
      type: Sequelize.INTEGER
    },
    nces_status: {
      type: Sequelize.INTEGER
    },
    nces_type: {
      type: Sequelize.INTEGER
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
