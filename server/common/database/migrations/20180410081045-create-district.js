'use strict';

const tableName = 'district';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(tableName, {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      validate: { notEmpty: true },
      unique: true
    },
    name: {
      type: Sequelize.STRING
    },
    nces_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: { notEmpty: true },
      unique: true
    },
    nces_type: {
      type: Sequelize.INTEGER
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
