'use strict';

const bunyan = require('bunyan');
const pkg = require('../../package.json');
const loggers = {};

module.exports = (name = pkg.name) => {
  if (loggers[name]) return loggers.name;
  return bunyan.createLogger({ name });
};
