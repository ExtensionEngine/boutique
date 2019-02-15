'use strict';

const config = require('../../sequelize.config.js');
const dargs = require('dargs');
const minimist = require('minimist');

const actions = [
  'migrate',
  'seed',
  'create',
  'drop'
];
const isAction = cmd => actions.some(it => cmd.startsWith(it));

const argv = minimist(process.argv.slice(2));
process.argv.length = 2;

// Resolve commands/args.
let [head = '', ...rest] = argv._;
if (isAction(head)) head = `db:${head}`;
process.argv.push(head, ...rest);

// Resolve flags.
const options = Object.assign({}, config, getOptions(argv));
process.argv.push(...dargs(options));

// Make it rain!
require('sequelize-cli/lib/sequelize');

function getOptions(argv) {
  return reduce(argv, (acc, val, key) => {
    if (['_', '--'].includes(key)) return acc;
    return Object.assign(acc, { [key]: val });
  }, {});
}

function reduce(obj, callback, initalValue) {
  return Object.keys(obj).reduce((acc, key) => {
    return callback(acc, obj[key], key);
  }, initalValue);
}
