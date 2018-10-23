'use strict';

const { getValidator, setLogging } = require('../common/database/helpers');
const { prompt } = require('inquirer');
const { role } = require('../../common/config');
const { User } = require('../common/database');
const humanize = require('humanize-string');
const isEmail = require('is-email-like');
const map = require('lodash/map');

setLogging(User, false);

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
