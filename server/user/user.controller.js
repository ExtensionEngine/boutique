'use strict';

const { createError } = require('../common/errors');
const { createWorkbook, getUsers } = require('./import');
const { Enrollment, Sequelize, sequelize, User } = require('../common/database');
const find = require('lodash/find');
const HttpStatus = require('http-status');
const map = require('lodash/map');
const pick = require('lodash/pick');
const Promise = require('bluebird');

const { BAD_REQUEST, CONFLICT, NOT_FOUND } = HttpStatus;
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
  return User.findOne({ where: { email: body.email }, paranoid: false })
    .then(existingUser => {
      if (existingUser && !existingUser.deletedAt) createError(CONFLICT);
      const opts = { existingUser, origin: req.origin() };
      return User.invite(pick(body, inputAttrs), opts);
    })
    .then(user => res.jsend.success(user.profile));
}

function patch({ params, body }, res) {
  return User.findById(params.id, { paranoid: false })
    .then(user => user || createError(NOT_FOUND, 'User does not exist!'))
    .then(user => user.update(pick(body, inputAttrs)))
    .then(user => res.jsend.success(user.profile));
}

function destroy({ params }, res) {
  sequelize.transaction(async transaction => {
    const user = await User.findById(params.id, { transaction });
    if (!user) createError(NOT_FOUND);
    await Enrollment.destroy({ where: { studentId: user.id }, transaction });
    await user.destroy({ transaction });
    res.end();
  });
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
      res.jsend.success({ token, user: user.profile });
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

async function importUsers(req, res) {
  const errors = [];
  const origin = req.origin();
  const users = await getUsers(req.file);
  const opts = {
    where: { email: map(users, user => user.email) },
    paranoid: false
  };
  const existingUsers = await User.findAll(opts);
  await Promise.map(users, user => {
    const existingUser = find(existingUsers, user);
    if (existingUser && !existingUser.deletedAt) {
      return errors.push(`User ${user.email}: Already exists!`);
    }
    return User.invite(pick(user, inputAttrs), { existingUser, origin })
      .catch(err => errors.push(`User ${user.email}: ${err.message}!`));
  });
  if (errors.length) {
    const wb = createWorkbook(errors);
    res.setHeader('Content-Type', 'application/vnd.ms-excel');
    res.setHeader('Content-disposition', 'attachment;filename=errors.xls');
    return wb.xlsx.write(res).then(() => res.end());
  }
  return res.end();
}

module.exports = {
  list,
  create,
  patch,
  destroy,
  login,
  forgotPassword,
  resetPassword,
  importUsers
};
