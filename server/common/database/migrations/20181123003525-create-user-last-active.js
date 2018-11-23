'use strict';

const TABLE_NAME = 'user';
const COLUMN_NAME = 'last_active';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(TABLE_NAME, COLUMN_NAME, Sequelize.DATE);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(TABLE_NAME, COLUMN_NAME);
  }
};
