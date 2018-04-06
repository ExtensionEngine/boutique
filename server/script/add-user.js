'use strict';

const { prompt } = require('inquirer');
const { role } = require('../../common/config');
const { User } = require('../common/database');
const capitalize = require('to-case').capital;
const isEmail = require('is-email-like');
const map = require('lodash/map');

const questions = [{
  type: 'input',
  name: 'email',
  validate: isEmail,
  message: 'Enter your email:'
}, {
  type: 'password',
  mask: '*',
  name: 'password',
  message: 'Enter password:'
}, {
  type: 'list',
  name: 'role',
  choices: map(role, value => ({ name: capitalize(value), value })),
  message: 'Select role:'
}];

prompt(questions)
  .then(data => User.create(data))
  .then(user => console.log(`User created: ${user.email}`))
  .catch(err => console.error(err.message) || 1)
  .then((code = 0) => process.exit(code));
