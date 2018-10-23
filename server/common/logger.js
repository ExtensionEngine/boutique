'use strict';

const Logger = withEmoji(require('bunyan'));
const pkg = require('../../package.json');
const safeRequire = require('safe-require');

const isProduction = process.env.NODE_ENV === 'production';
// NOTE: Copied from bili (by @egoist): https://git.io/fxupU
const supportsEmoji = process.platform !== 'win32' ||
                      process.env.TERM === 'xterm-256color';

const Level = getLevels(Logger);
const loggers = {};

function createLogger(name, options = {}) {
  name = pkg.name + (name ? `:${name}` : '');
  const serializers = { ...Logger.stdSerializers, ...options.serializers };
  if (!loggers[name]) loggers[name] = new Logger({ ...options, name, serializers });
  return loggers[name];
}
Object.assign(createLogger, Logger, { createLogger, Level });

module.exports = createLogger;

function getLevels(Logger) {
  const { levelFromName: levels } = Logger;
  return Object.keys(levels).reduce((acc, name) => {
    return Object.assign(acc, { [name.toUpperCase()]: levels[name] });
  }, {});
}

function withEmoji(Logger) {
  const addStream = Logger.prototype.addStream;
  Logger.prototype.addStream = function (stream, defaultLevel) {
    stream = stream || {};
    if (!isProduction && stream.stream) {
      stream.stream = getOutputStream(stream.stream);
    }
    return addStream.call(this, stream, defaultLevel);
  };
  return Logger;
}

function getOutputStream(stream) {
  if (stream !== process.stdout || supportsEmoji) return stream;
  const stripEmoji = safeRequire('emoji-strip');
  if (!stripEmoji) return stream;
  stream = map(record => {
    record.msg = stripEmoji(record.msg);
    return record;
  });
  stream.pipe(process.stdout);
  return stream;
}

function map(mapper) {
  const split = require('split2');
  return split(line => {
    const record = JSON.parse(line);
    return JSON.stringify(mapper(record)) + '\n';
  });
}
