'use strict';

const inRange = require('lodash/inRange');
const notEmpty = input => input.length > 0;

module.exports = {
  alterEnum,
  getValidator,
  setLogging
};

// NOTE: Enables safe altering of ENUM values: https://git.io/fxzeS
function alterEnum(queryInterface, Sequelize, table, column, options = {}) {
  const { QueryGenerator, sequelize } = queryInterface;
  const str = { type: Sequelize.STRING, allowNull: false };
  return queryInterface.changeColumn(table, column, str)
    .then(() => sequelize.query(QueryGenerator.pgEnumDrop(table, column)))
    .then(() => queryInterface.changeColumn(table, column, options));
}

function getValidator(Model, attribute) {
  return function validate(input) {
    const validator = Model.prototype.validators[attribute];
    if (!validator || !validator.len) {
      return notEmpty(input) || `"${attribute}" can not be empty`;
    }
    const [min, max] = validator.len;
    return inRange(input.length, min, max) ||
      `"${attribute}" must be between ${min} and ${max} characters long`;
  };
}

function setLogging(Model, state) {
  const { options } = Model.sequelize;
  options.logging = state;
  return options.logging;
}
