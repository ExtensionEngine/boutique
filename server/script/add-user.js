'use strict';

const { prompt } = require('inquirer');
const { role } = require('../../common/config');
const { User } = require('../common/database');
const humanize = require('humanize-string');
const inRange = require('lodash/inRange');
const isEmail = require('is-email-like');
const map = require('lodash/map');
const set = require('lodash/set');

const noop = Function.prototype;
const notEmpty = input => input.length > 0;

// Disable Sequelize SQL logging.
set(User, 'sequelize.options.logging', noop);

const questions = [{
  type: 'input',
  name: 'email',
  message: 'Enter email:',
  validate: isEmail
}, {
  type: 'password',
  mask: '*',
  name: 'password',
  message: 'Enter password:',
  validate: getValidator(User, 'password')
}, {
  type: 'string',
  name: 'firstName',
  message: 'Enter first name:',
  validate: getValidator(User, 'firstName')
}, {
  type: 'string',
  name: 'lastName',
  message: 'Enter last name:',
  validate: getValidator(User, 'lastName')
}, {
  type: 'list',
  name: 'role',
  choices: map(role, value => ({ name: humanize(value), value })),
  message: 'Select role:'
}];

prompt(questions)
  .then(data => console.log() || User.create(data))
  .then(user => console.log(`User created: ${user.email}`))
  .catch(err => console.error(err.message) || 1)
  .then((code = 0) => process.exit(code));

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
