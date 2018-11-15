'use strict';

const { Sequelize, Op } = require('sequelize');
const isMatchWith = require('lodash/isMatchWith');
const last = require('lodash/last');

// eslint-disable-next-line no-extra-parens
const AsyncFunction = (async function () {}).constructor;

const isAsyncFunction = arg => arg instanceof AsyncFunction;
const inRange = require('lodash/inRange');
const notEmpty = input => input.length > 0;

module.exports = {
  getValidator,
  setLogging,
  seqConcat,
  seqWhere,
  wrapAsyncMethods
};

function wrapAsyncMethods(Model, wrapper = require('bluebird').method) {
  const transformer = ({ value }) => isAsyncFunction(value) && wrapper(value);
  transformProperties(Model, transformer);
  transformProperties(Model.prototype, transformer);
  return Model;
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

function transformProperties(obj, cb) {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  Object.keys(descriptors).forEach(name => {
    const val = cb(descriptors[name], name);
    if (val) obj[name] = val;
  });
}

function seqConcat() {
  const [options, args] = parse({ separator: '' }, ...arguments);
  if (!options.separator) return Sequelize.fn('concat', ...args);
  return Sequelize.fn('concat_ws', options.separator, ...args);
}

function seqWhere() {
  const [options, args] = parse({ scope: false }, ...arguments);
  if (!options.scope) return Sequelize.where(...args);
  return { [Op.and]: [Sequelize.where(...args)] };
}

function matches(obj, defaults) {
  const isSameType = (arg1, arg2) => typeof arg1 === typeof arg2;
  return isMatchWith(obj, defaults, isSameType);
}

function parse(defaultOptions, ...args) {
  let options = last(args);
  options = matches(options, defaultOptions) ? args.pop() : defaultOptions;
  return [options, args];
}
