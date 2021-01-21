'use strict';

const TABLE_NAME = 'enrollment';
const COLUMN_NAME_BEFORE = 'student_id';
const COLUMN_NAME_AFTER = 'learner_id';

module.exports = {
  up: queryInterface => {
    return queryInterface.renameColumn(TABLE_NAME, COLUMN_NAME_BEFORE, COLUMN_NAME_AFTER);
  },

  down: queryInterface => {
    return queryInterface.renameColumn(TABLE_NAME, COLUMN_NAME_AFTER, COLUMN_NAME_BEFORE);
  }
};
