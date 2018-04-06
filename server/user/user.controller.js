'use strict';

const httpError = require('http-errors');
const HttpStatus = require('http-status');
const { User } = require('../common/database');

const { BAD_REQUEST, NOT_FOUND } = HttpStatus;

function createError(code = NOT_FOUND, message = 'An error has occured') {
  return Promise.reject(httpError(code, message, { custom: true }));
}

function login({ body }, res, next) {
  const { email, password } = body;
  if (!email || !password) {
    return next(createError(BAD_REQUEST, 'Please enter email and password'));
  }

  return User.find({ where: { email } })
    .then(user => user || createError(NOT_FOUND, 'User does not exist'))
    .then(user => user.authenticate(password))
    .then(user => user || createError(NOT_FOUND, 'Wrong password'))
    .then(user => {
      const token = user.createToken({ expiresIn: '5 days' });
      res.jsend.success({ token, user });
    });
}

function forgotPassword({ body }, res, next) {
  let { email } = body;
  return User.find({ where: { email } })
    .then(user => user || createError(NOT_FOUND, 'User not found'))
    .then(user => user.sendResetToken())
    .then(() => res.end());
}

function resetPassword({ body, params }, res, next) {
  const { password, token } = body;
  return User.find({ where: { token } })
    .then(user => user || createError(NOT_FOUND, 'Invalid token'))
    .then(user => {
      user.password = password;
      return user.save();
    })
    .then(() => res.end());
}

module.exports = {
  login,
  forgotPassword,
  resetPassword
};
