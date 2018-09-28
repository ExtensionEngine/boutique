'use strict';

const { createError } = require('../errors');
const HttpStatus = require('http-status');
const Role = require('../../../common/config/role');

const { UNAUTHORIZED, FORBIDDEN } = HttpStatus;

function authorize(...allowed) {
  allowed.push(Role.ADMIN);
  return ({ user }, res, next) => {
    if (!user) return createError(UNAUTHORIZED, 'Access restricted');
    if (!allowed.includes(user.role)) {
      return createError(FORBIDDEN, 'Access denied');
    }
    return next();
  };
}

module.exports = {
  authorize
};
