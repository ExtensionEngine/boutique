'use strict';

const httpError = require('http-errors');

function createError(code = 400, message = 'An error has occured') {
  return Promise.reject(httpError(code, message, { custom: true }));
}

module.exports = {
  createError
};
