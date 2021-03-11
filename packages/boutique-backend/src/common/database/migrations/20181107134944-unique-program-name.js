'use strict';

const TABLE_NAME = 'program';
const CONSTRAINT_NAME = 'unique_program_name';

module.exports = {
  up: qi => qi.addConstraint(TABLE_NAME, {
    name: CONSTRAINT_NAME,
    type: 'unique',
    fields: ['name']
  }),
  down: qi => qi.removeConstraint(TABLE_NAME, CONSTRAINT_NAME)
};
