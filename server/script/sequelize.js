'use strict';

const config = require('../../sequelize.config.js');
const dargs = require('dargs');

const isGenerator = input => input.includes(':generate') || input.includes(':create');

const delimiter = ':';
const shorthands = [
  'migrate',
  'seed',
  'create',
  'drop'
];

const input = process.argv[2] || '';
const [cmd] = input.split(delimiter);

if (!isGenerator(input) && cmd && shorthands.includes(cmd)) {
  process.argv[2] = `db:${input}`;
}
if (cmd) process.argv.push(...dargs(config));

require('sequelize-cli/lib/sequelize');
