'use strict';

const { createError } = require('../common/errors');
const { User } = require('../common/database');
const HttpStatus = require('http-status');
const map = require('lodash/map');
const pick = require('lodash/pick');

const { BAD_REQUEST, NOT_FOUND } = HttpStatus;
const inputAttrs = ['email', 'role', 'firstName', 'lastName'];

function list({ query: { email } }, res, next) {
  const where = {};
  if (email) where.email = email;
  return User.findAll({ where })
    .then(users => res.jsend.success(map(users, 'profile')));
}

function create({ body }, res, next) {
  return User.findOne({ where: { email: body.email } })
    .then(user => !user || createError(NOT_FOUND, 'User already exists!'))
    .then(() => User.invite(pick(body, inputAttrs)))
    .then(user => res.jsend.success({ user: user.profile }));
}

function patch({ params, body }, res, next) {
  return User.findById(params.id, { paranoid: false })
    .then(user => user || createError(NOT_FOUND, 'User does not exist!'))
    .then(user => user.update(pick(body, inputAttrs)))
    .then(user => res.jsend.success({ user: user.profile }));
}

function login({ body }, res, next) {
  const { email, password } = body;
  if (!email || !password) {
    return next(createError(BAD_REQUEST, 'Please enter email and password!'));
  }

  return User.find({ where: { email } })
    .then(user => user || createError(NOT_FOUND, 'User does not exist!'))
    .then(user => user.authenticate(password))
    .then(user => user || createError(NOT_FOUND, 'Wrong password!'))
    .then(user => {
      const token = user.createToken({ expiresIn: '5 days' });
      res.jsend.success({ token, user: user.profile });
    });
}

function forgotPassword({ body }, res, next) {
  let { email } = body;
  return User.find({ where: { email } })
    .then(user => user || createError(NOT_FOUND, 'User not found!'))
    .then(user => user.sendResetToken())
    .then(() => res.end());
}

function resetPassword({ body, params }, res, next) {
  const { password, token } = body;
  return User.find({ where: { token } })
    .then(user => user || createError(NOT_FOUND, 'Invalid token!'))
    .then(user => {
      user.password = password;
      return user.save();
    })
    .then(() => res.end());
}

module.exports = {
  list,
  create,
  patch,
  login,
  forgotPassword,
  resetPassword
};
