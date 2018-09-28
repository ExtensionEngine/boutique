'use strict';

const { createError } = require('../common/errors');
const { Enrollment, Sequelize, User } = require('../common/database');
const get = require('lodash/get');
const HttpStatus = require('http-status');
const map = require('lodash/map');
const pick = require('lodash/pick');

const { BAD_REQUEST, NOT_FOUND } = HttpStatus;
const inputAttrs = ['email', 'role', 'firstName', 'lastName'];
const Op = Sequelize.Op;

const createFilter = q => map(['email', 'firstName', 'lastName'],
  it => ({ [it]: { [Op.iLike]: `%${q}%` } }));

function list({ query: { email, role, filter }, options }, res) {
  const where = { [Op.and]: [] };
  if (filter) where[Op.or] = createFilter(filter);
  if (email) where[Op.and].push({ email });
  if (role) where[Op.and].push({ role });
  return User.findAndCountAll({ where, ...options }).then(({ rows, count }) => {
    return res.jsend.success({ items: map(rows, 'profile'), total: count });
  });
}

function create(req, res) {
  const { body } = req;
  const origin = req.origin();
  return User.findOne({ where: { email: body.email } })
    .then(user => !user || createError(NOT_FOUND, 'User already exists!'))
    .then(() => User.invite(pick(body, inputAttrs), { origin }))
    .then(user => res.jsend.success(user.profile));
}

function patch({ params, body }, res) {
  return User.findById(params.id, { paranoid: false })
    .then(user => user || createError(NOT_FOUND, 'User does not exist!'))
    .then(user => user.update(pick(body, inputAttrs)))
    .then(user => res.jsend.success(user.profile));
}

function login({ body }, res) {
  const { email, password } = body;
  if (!email || !password) {
    return createError(BAD_REQUEST, 'Please enter email and password!');
  }

  return User.find({ where: { email } })
    .then(user => user || createError(NOT_FOUND, 'User does not exist!'))
    .then(user => user.authenticate(password))
    .then(user => user || createError(NOT_FOUND, 'Wrong password!'))
    .then(user => {
      const token = user.createToken({ expiresIn: '5 days' });
      Enrollment.findOne({ where: { studentId: user.id } }).then(data => {
        res.jsend.success({
          token,
          user: { ...user.profile, cohortId: get(data, 'cohortId', 0) }
        });
      });
    });
}

function forgotPassword(req, res) {
  const { email } = req.body;
  const origin = req.origin();
  return User.find({ where: { email } })
    .then(user => user || createError(NOT_FOUND, 'User not found!'))
    .then(user => user.sendResetToken({ origin }))
    .then(() => res.end());
}

function resetPassword({ body, params }, res) {
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
