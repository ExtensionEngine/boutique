'use strict';

const TABLE_NAME = 'program';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(TABLE_NAME, 'start_date', Sequelize.DATE)
      .then(() => {
        return queryInterface.addColumn(TABLE_NAME, 'end_date', Sequelize.DATE);
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(TABLE_NAME, 'start_date')
      .then(() => {
        return queryInterface.removeColumn(TABLE_NAME, 'end_date');
      });
  }
};
