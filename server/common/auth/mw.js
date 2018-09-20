'use strict';

const { createError } = require('../errors');
const HttpStatus = require('http-status');
const Role = require('../../../common/config/role');

const { UNAUTHORIZED, FORBIDDEN } = HttpStatus;

function authorize(...allowed) {
  allowed.push(Role.ADMIN);
  return ({ user }, res, next) => {
    return user
      ? allowed.includes(user.role)
        ? next()
        : createError(FORBIDDEN, 'Access denied')
      : createError(UNAUTHORIZED, 'Access restricted');
  };
}

module.exports = {
  authorize
};
