'use strict';

const { timestamps } = require('../mixins');
const TABLE_NAME = 'program';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(TABLE_NAME, {
    ...timestamps(Sequelize),
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false
    }
  }),
  down: (queryInterface) => queryInterface.dropTable(TABLE_NAME)
};
