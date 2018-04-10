'use strict';

const { User } = require('../common/database');
const httpError = require('http-errors');
const HttpStatus = require('http-status');
const map = require('lodash/map');
const pick = require('lodash/pick');

const { BAD_REQUEST, NOT_FOUND } = HttpStatus;

function createError(code = 400, message = 'An error has occured') {
  return Promise.reject(httpError(code, message, { custom: true }));
}

function list({ query }, res, next) {
  const { email } = query;
  const where = {};
  if (email) where.email = email;
  return User.findAll({ where })
    .then(users => res.jsend.success(map(users, 'profile')));
}

function create({ body }, res, next) {
  const attrs = ['email', 'role', 'firstName', 'lastName'];
  return User.findOne({ where: { email: body.email } })
    .then(user => user || User.invite(pick(body, attrs)))
    .then(user => res.jsend.success({ user: user.profile }))
    .catch(err => next(err));
}

function patch({ params, body }, res, next) {
  return User.findById(params.id, { paranoid: false })
    .then(user => user || createError(NOT_FOUND, 'User does not exist'))
    .then(user => user.update(pick(body, ['email', 'role', 'firstName', 'lastName'])))
    .then(user => res.jsend.success({ user: user.profile }))
    .catch(err => next(err));
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
      res.jsend.success({ token, user: user.profile });
    })
    .catch(err => next(err));
}

function forgotPassword({ body }, res, next) {
  let { email } = body;
  return User.find({ where: { email } })
    .then(user => user || createError(NOT_FOUND, 'User not found'))
    .then(user => user.sendResetToken())
    .then(() => res.end())
    .catch(err => next(err));
}

function resetPassword({ body, params }, res, next) {
  const { password, token } = body;
  return User.find({ where: { token } })
    .then(user => user || createError(NOT_FOUND, 'Invalid token'))
    .then(user => {
      user.password = password;
      return user.save();
    })
    .then(() => res.end())
    .catch(err => next(err));
}

module.exports = {
  list,
  create,
  patch,
  login,
  forgotPassword,
  resetPassword
};
