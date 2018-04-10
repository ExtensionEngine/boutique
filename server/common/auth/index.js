'use strict';

const { auth: config = {} } = require('../../config');
const { ExtractJwt, Strategy } = require('passport-jwt');
const { User } = require('../database');
const passport = require('passport');

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

module.exports = {
  initialize(options = {}) {
    return passport.initialize(options);
  },
  authenticate(strategy, options = {}) {
    // NOTE:  passport to forward errors down the middleware chain:
    // https://github.com/jaredhanson/passport/blob/ad5fe1dfaeb79f81ba21f99e6025daa0dec87e6e/lib/middleware/authenticate.js#L171
    return passport.authenticate(strategy, { ...options, failWithError: true });
  }
};
