'use strict';

const Promise = require('bluebird');

const TABLE_NAME = 'program';
const COLUMNS = ['start_date', 'end_date'];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.each(COLUMNS, column => {
      return queryInterface.addColumn(TABLE_NAME, column, Sequelize.DATE);
    });
  },
  down: (queryInterface, Sequelize) => {
    return Promise.each(COLUMNS, column => {
      return queryInterface.removeColumn(TABLE_NAME, column);
    });
  }
};
