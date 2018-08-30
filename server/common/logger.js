'use strict';

const Logger = withEmoji(require('bunyan'));
const pkg = require('../../package.json');
const stripEmoji = require('emoji-strip');

const isMacOS = process.platform === 'darwin';
const isString = arg => typeof arg === 'string';

const loggers = {};

module.exports = (name = pkg.name) => {
  if (!loggers[name]) loggers[name] = new Logger({ name });
  return loggers[name];
};

function withEmoji(Logger) {
  Object.keys(Logger.levelFromName).forEach(name => {
    const log = Logger.prototype[name];
    Logger.prototype[name] = function (...args) {
      if (isMacOS) return log.apply(this, args);
      args = args.map(it => !isString(it) ? it : stripEmoji(it));
      return log.apply(this, args);
    };
  });
  return Logger;
}
