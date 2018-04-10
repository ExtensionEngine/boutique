'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('school', {
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
    nces_school_level: {
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
  down: queryInterface => queryInterface.dropTable('school')
};
