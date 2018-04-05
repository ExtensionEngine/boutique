'use strict';

const includes = (arr, item) => arr.indexOf(item) !== -1;

const delimiter = ':';
const shorthands = [
  'migrate',
  'seed',
  'create',
  'drop'
];

const input = process.argv[2] || '';
const [cmd] = input.split(delimiter);

if (cmd && includes(shorthands, cmd)) {
  process.argv[2] = `db:${input}`;
}
require('sequelize-cli/lib/sequelize');
