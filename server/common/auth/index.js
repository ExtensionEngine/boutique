'use strict';

const Audience = require('./audience');
const auth = require('./authenticator');
const { auth: config = {} } = require('../../config');
const get = require('lodash/get');
const LocalStrategy = require('passport-local');
const { Strategy } = require('passport-jwt');
const { User } = require('../database');

const options = {
  usernameField: 'email',
  session: false
};

auth.use(new LocalStrategy(options, (email, password, done) => {
  return User.findOne({ where: { email } })
    .then(user => user && user.authenticate(password))
    .then(user => done(null, user || false))
    .error(err => done(err, false));
}));

const jwtOptions = {
  ...config,
  jwtFromRequest: extractJwtFromCookie,
  secretOrKey: config.secret,
  audience: Audience.Scope.Access
};

auth.use(new Strategy(jwtOptions, (payload, done) => {
  return User.findByPk(payload.id)
    .then(user => done(null, user ? user.logActivity() : false))
    .error(err => done(err, false));
}));

auth.serializeUser((user, done) => done(null, user));
auth.deserializeUser((user, done) => done(null, user));

module.exports = auth;

function extractJwtFromCookie(req) {
  const path = config.cookie.signed ? 'signedCookies' : 'cookies';
  return get(req[path], config.cookie.name, null);
}
