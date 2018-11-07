'use strict';

const TABLE_NAME = 'program';
const CONSTRAINT_NAME = 'unique_program_name';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint(TABLE_NAME, ['name'], {
      type: 'unique',
      name: CONSTRAINT_NAME
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint(TABLE_NAME, CONSTRAINT_NAME);
  }
};
