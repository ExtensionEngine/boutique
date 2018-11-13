'use strict';

const { createError } = require('../common/errors');
const { Enrollment, Sequelize, sequelize, User } = require('../common/database');
const Datasheet = require('./datasheet');
const HttpStatus = require('http-status');
const mime = require('mime');
const map = require('lodash/map');
const pick = require('lodash/pick');

const { ACCEPTED, BAD_REQUEST, CONFLICT, NO_CONTENT, NOT_FOUND } = HttpStatus;
const { EmptyResultError, Op } = Sequelize;

const columns = {
  email: { header: 'Email', width: 30 },
  firstName: { header: 'First Name', width: 30 },
  lastName: { header: 'Last Name', width: 30 },
  role: { header: 'Role', width: 30 },
  message: { header: 'Error', width: 30 }
};
const inputAttrs = ['email', 'role', 'firstName', 'lastName'];

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

async function create(req, res) {
  const { body, origin } = req;
  const [err, user] = await User.restoreOrBuild(pick(body, inputAttrs));
  if (err) return createError(CONFLICT, 'User exists!');
  await User.invite(user, { origin });
  res.jsend.success(user.profile);
}

function patch({ params, body }, res) {
  return User.findByPk(params.id, { paranoid: false, rejectOnEmpty: true })
    .catch(EmptyResultError, () => createError(NOT_FOUND, 'User does not exist!'))
    .then(user => user.update(pick(body, inputAttrs)))
    .then(user => res.jsend.success(user.profile));
}

function destroy({ params }, res) {
  return sequelize.transaction(async transaction => {
    const user = await User.findByPk(params.id, { transaction, rejectOnEmpty: true });
    await Enrollment.destroy({ where: { studentId: user.id }, transaction });
    return user.destroy({ transaction });
  })
  .catch(EmptyResultError, () => createError(NOT_FOUND))
  .then(() => res.sendStatus(NO_CONTENT));
}

function login({ body }, res) {
  const { email, password } = body;
  if (!email || !password) {
    return createError(BAD_REQUEST, 'Please enter email and password!');
  }

  return User.findOne({ where: { email }, rejectOnEmpty: true })
    .catch(EmptyResultError, () => createError(NOT_FOUND, 'User does not exist!'))
    .then(user => user.authenticate(password))
    .then(user => user || createError(NOT_FOUND, 'Wrong password!'))
    .then(user => {
      const token = user.createToken({ expiresIn: '5 days' });
      res.jsend.success({ token, user: user.profile });
    });
}

function invite({ params, origin }, res) {
  return User.findById(params.id, { paranoid: false })
    .then(user => user || createError(NOT_FOUND, 'User does not exist!'))
    .then(user => User.invite(user, { origin }))
    .then(() => res.status(ACCEPTED).end());
}

function forgotPassword(req, res) {
  const { email } = req.body;
  const origin = req.origin();
  return User.findOne({ where: { email }, rejectOnEmpty: true })
    .catch(EmptyResultError, () => createError(NOT_FOUND, 'User not found!'))
    .then(user => user.sendResetToken({ origin }))
    .then(() => res.end());
}

function resetPassword({ body, params }, res) {
  const { password, token } = body;
  return User.findOne({ where: { token }, rejectOnEmpty: true })
    .catch(EmptyResultError, () => createError(NOT_FOUND, 'Invalid token!'))
    .then(user => {
      user.password = password;
      return user.save();
    })
    .then(() => res.end());
}

async function bulkImport(req, res) {
  const origin = req.origin();
  let users = (await Datasheet.load(req.file)).toJSON({ include: inputAttrs });
  const errors = await bulkCreate(users, { origin });
  if (!errors) return res.end();
  const creator = 'Boutique';
  const format = req.body.format || mime.getExtension(req.file.mimetype);
  const report = (new Datasheet({ columns, data: errors })).toWorkbook({ creator });
  return report.send(res, { format });
}

module.exports = {
  list,
  bulkImport,
  create,
  patch,
  destroy,
  login,
  invite,
  forgotPassword,
  resetPassword
};

async function bulkCreate(users, { concurrency = 16, ...options } = {}) {
  const errors = [];
  await User.restoreOrBuildAll(users, { concurrency })
    .map(([err, user], index) => {
      if (!err && user) return User.invite(user, options);
      const { message = 'Failed to import user.' } = err;
      errors.push({ ...users[index], message });
    }, { concurrency });
  return errors.length && errors;
}
