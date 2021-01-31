'use strict';

const { Enrollment, Sequelize, sequelize, User } = require('../common/database');
const Audience = require('../common/auth/audience');
const { createError } = require('../common/errors');
const Datasheet = require('./datasheet');
const { generate } = require('./helpers');
const HttpStatus = require('http-status');
const map = require('lodash/map');
const mime = require('mime');
const pick = require('lodash/pick');

const { ACCEPTED, BAD_REQUEST, CONFLICT, NOT_FOUND } = HttpStatus;
const { Op } = Sequelize;

const columns = {
  email: { header: 'Email', width: 30 },
  firstName: { header: 'First Name', width: 30 },
  lastName: { header: 'Last Name', width: 30 },
  role: { header: 'Role', width: 30 }
};
const inputAttrs = ['email', 'role', 'firstName', 'lastName'];

const createFilter = q => map(['email', 'firstName', 'lastName'],
  it => ({ [it]: { [Op.iLike]: `%${q}%` } }));

function list({ query: { email, role, filter, archived }, options }, res) {
  const where = { [Op.and]: [] };
  if (filter) where[Op.or] = createFilter(filter);
  if (email) where[Op.and].push({ email });
  if (role) where[Op.and].push({ role });
  return User.findAndCountAll({ where, ...options, paranoid: !archived })
    .then(({ rows, count }) => {
      return res.jsend.success({ items: map(rows, 'profile'), total: count });
    });
}

function create(req, res) {
  const { body, origin } = req;
  return User.restoreOrBuild(pick(body, inputAttrs))
    .then(([result]) => {
      if (result.isRejected()) return createError(CONFLICT);
      return User.invite(result.value(), { origin });
    })
    .then(user => res.jsend.success(user.profile));
}

function patch({ params, body }, res) {
  return User.findByPk(params.id, { paranoid: false })
    .then(user => user || createError(NOT_FOUND, 'User does not exist!'))
    .then(user => user.update(pick(body, inputAttrs)))
    .then(user => res.jsend.success(user.profile));
}

function destroy({ params }, res) {
  sequelize.transaction(async transaction => {
    const user = await User.findByPk(params.id, { transaction });
    if (!user) createError(NOT_FOUND);
    await Enrollment.destroy({ where: { learnerId: user.id }, transaction });
    await user.destroy({ transaction });
    res.end();
  });
}

function login({ body }, res) {
  const { email, password } = body;
  if (!email || !password) {
    return createError(BAD_REQUEST, 'Please enter email and password!');
  }

  return User.findOne({ where: { email } })
    .then(user => user || createError(NOT_FOUND, 'User does not exist!'))
    .then(user => user.authenticate(password))
    .then(user => user || createError(NOT_FOUND, 'Wrong password!'))
    .then(user => {
      const token = user.createToken({
        audience: Audience.Scope.Access,
        expiresIn: '5 days'
      });
      res.jsend.success({ token, user: user.profile });
    });
}

function logout(req, res) {
  const id = req.user.id;
  return User.findById(id)
    .then(user => user.session.end())
    .then(() => res.end());
}

function invite({ params, origin }, res) {
  return User.findByPk(params.id, { paranoid: false })
    .then(user => user || createError(NOT_FOUND, 'User does not exist!'))
    .then(user => User.invite(user, { origin }))
    .then(() => res.status(ACCEPTED).end());
}

function forgotPassword({ origin, body }, res) {
  const { email } = body;
  return User.findOne({ where: { email } })
    .then(user => user || createError(NOT_FOUND, 'User not found!'))
    .then(user => user.sendResetToken({ origin }))
    .then(() => res.end());
}

function resetPassword({ body }, res) {
  const { password, token } = body;
  return User.findOne({ where: { token } })
    .then(user => user || createError(NOT_FOUND, 'Invalid token!'))
    .then(user => {
      user.password = password;
      return user.save();
    })
    .then(() => res.end());
}

async function bulkImport({ body, file, origin }, res) {
  const users = (await Datasheet.load(file)).toJSON({ include: inputAttrs });
  const errors = await User.import(users, { origin: origin });
  res.set('data-imported-count', users.length - errors.length);
  if (!errors.length) return res.end();
  const creator = 'Boutique';
  columns.message = { header: 'Error', width: 30 };
  const report = (new Datasheet({ columns, data: errors })).toWorkbook({ creator });
  const format = body.format || mime.getExtension(file.mimetype);
  return report.send(res, { format });
}

function getImportTemplate(req, res) {
  const creator = 'Boutique';
  const data = generate();
  const report = (new Datasheet({ columns, data })).toWorkbook({ creator });
  return report.send(res, { format: 'xlsx' });
}

module.exports = {
  list,
  create,
  bulkImport,
  patch,
  destroy,
  login,
  logout,
  invite,
  forgotPassword,
  resetPassword,
  getImportTemplate
};
