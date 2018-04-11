'use strict';

const { hostname } = require('../config');
const logger = require('./logger')();

const isProduction = process.env.NODE_ENV === 'production';

module.exports = () => {
  if (hostname) return middleware;
  const message = '"HOSTNAME" is not set, using "Host" HTTP header.';
  isProduction ? logger.warn('⚠️ ', message) : logger.info(message);
  return middleware;
};

function middleware(req, res, next) {
  req.origin = () => `${req.protocol}://${hostname || req.get('host')}`;
  next();
}
