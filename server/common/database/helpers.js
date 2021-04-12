'use strict';

const { Op, Sequelize } = require('sequelize');
const has = require('lodash/has');
const inRange = require('lodash/inRange');
const last = require('lodash/last');

const isFunction = arg => typeof arg === 'function';
const notEmpty = input => input.length > 0;

const sql = {
  concat,
  where
};

module.exports = {
  sql,
  getValidator,
  wrapMethods,
  alterEnum
};

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

function concat(...args) {
  const options = has(last(args), 'separator') ? args.pop() : {};
  if (!options.separator) return Sequelize.fn('concat', ...args);
  return Sequelize.fn('concat_ws', options.separator, ...args);
}

// NOTE: Fixes https://github.com/sequelize/sequelize/issues/6440
function where(attribute, logic, options = {}) {
  const { comparator = '=', scope = false } = options;
  const where = Sequelize.where(attribute, comparator, logic);
  return !scope ? where : { [Op.and]: [where] };
}

// NOTE: Enables safe altering of ENUM values: https://git.io/fxzeS
function alterEnum(qi, { table, column, ...options } = {}) {
  const { queryGenerator, sequelize } = qi;
  const str = { type: Sequelize.STRING, allowNull: false };
  return qi.changeColumn(table, column, str)
    .then(() => sequelize.query(queryGenerator.pgEnumDrop(table, column)))
    .then(() => qi.changeColumn(table, column, options));
}

function wrapMethods(Model, Promise) {
  let Ctor = Model;
  do {
    const methods = getMethods(Ctor.prototype);
    const staticMethods = getMethods(Ctor);
    [...methods, ...staticMethods].forEach(method => wrapMethod(method, Promise));
    Ctor = Object.getPrototypeOf(Ctor);
  } while (Ctor !== Sequelize.Model && Ctor !== Function.prototype);
  return Model;
}

function wrapMethod({ key, value, target }, Promise) {
  target[key] = function () {
    const result = value.apply(this, arguments);
    if (!result || !isFunction(result.catch)) return result;
    return Promise.resolve(result);
  };
}

function getMethods(object) {
  return getProperties(object)
    .filter(({ key, value }) => isFunction(value) && key !== 'constructor');
}

function getProperties(object) {
  return Reflect.ownKeys(object).map(key => {
    const { value } = Reflect.getOwnPropertyDescriptor(object, key);
    return { key, value, target: object };
  });
}
