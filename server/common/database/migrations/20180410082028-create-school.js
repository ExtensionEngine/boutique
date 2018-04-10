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
    ncesId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: { notEmpty: true },
      unique: true
    },
    ncesType: {
      type: Sequelize.INTEGER
    },
    ncesSchoolLevel: {
      type: Sequelize.INTEGER
    },
    state: {
      type: Sequelize.STRING(2)
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('school')
};
