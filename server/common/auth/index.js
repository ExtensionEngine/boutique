'use strict';

const { auth: config = {} } = require('../../config');
const { ExtractJwt, Strategy } = require('passport-jwt');
const passport = require('passport');
const { User } = require('../database');

const jwtOptions = {
  ...config,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme(config.scheme),
  secretOrKey: config.secret
};

passport.use(new Strategy(jwtOptions, (payload, done) => {
  return User.findById(payload.id)
    .then(user => done(null, user || false))
    .error(err => done(err, false));
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
