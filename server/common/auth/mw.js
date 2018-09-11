'use strict';

const { createError } = require('../errors');
const HttpStatus = require('http-status');
const Role = require('../../../common/config/role');

const { UNAUTHORIZED } = HttpStatus;

function authorize(...allowed) {
  allowed.push(Role.ADMIN);
  return ({ user }, res, next) => {
    if (user && allowed.includes(user.role)) return next();
    return createError(UNAUTHORIZED, 'Access restricted');
  };
}

module.exports = {
  authorize
};
