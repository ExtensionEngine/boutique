'use strict';

const TABLE_NAME = 'program';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(TABLE_NAME, 'starting_date', Sequelize.DATE)
      .then(() => {
        return queryInterface.addColumn(TABLE_NAME, 'ending_date', Sequelize.DATE);
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(TABLE_NAME, 'starting_date').then(function () {
      return queryInterface.removeColumn(TABLE_NAME, 'ending_date');
    });
  }
};
