'use strict';

const includes = require('lodash/includes');

const actions = [
  'migrate',
  'seed',
  'create',
  'drop'
];
const delimiter = ':';

const input = process.argv[2] || '';
const [cmd] = input.split(delimiter);

if (includes(actions, cmd)) {
  process.argv[2] = `db:${input}`;
}
require('sequelize-cli/lib/sequelize');
