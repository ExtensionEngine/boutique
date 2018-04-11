'use strict';

const { hostname } = require('../config');
const logger = require('./logger')();

module.exports = () => {
  if (!hostname) {
    logger.warn('⚠️  "HOSTNAME" is not set, using "Host" HTTP header.');
  }
  return middleware;
};

function middleware(req, res, next) {
  req.origin = () => `${req.protocol}://${hostname || req.get('host')}`;
  next();
}
