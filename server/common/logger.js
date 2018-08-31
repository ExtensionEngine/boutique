'use strict';

const Logger = withEmoji(require('bunyan'));
const pkg = require('../../package.json');
const safeRequire = require('safe-require');

const isMacOS = process.platform === 'darwin';
const isProduction = process.env.NODE_ENV === 'production';

const loggers = {};

function createLogger(name, options = {}) {
  name = pkg.name + (name ? `:${name}` : '');
  if (!loggers[name]) loggers[name] = new Logger({ ...options, name });
  return loggers[name];
}
Object.assign(createLogger, Logger);

module.exports = createLogger;

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
  if (stream !== process.stdout || isMacOS) return stream;
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
