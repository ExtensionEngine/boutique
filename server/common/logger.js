'use strict';

const Bunyan = require('bunyan');
const pkg = require('../../package.json');
const safeRequire = require('safe-require');

const isMacOS = process.platform === 'darwin';
const isProduction = process.env.NODE_ENV === 'production';

const loggers = {};

class Logger extends Bunyan {
  addStream(stream, defaultLevel) {
    stream = stream || {};
    if (!isProduction && stream.stream) {
      stream.stream = getOutputStream(stream.stream);
    }
    return super.addStream(stream, defaultLevel);
  }
}

module.exports = (name = pkg.name, options = {}) => {
  if (!loggers[name]) loggers[name] = new Logger({ ...options, name });
  return loggers[name];
};

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
