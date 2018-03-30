const createError = require('http-errors');
const HttpStatus = require('http-status');
const { User } = require('../database');

const { BAD_REQUEST, NOT_FOUND } = HttpStatus;

function login({ body }, res, next) {
  const { email, password } = body;
  if (!email || !password) {
    return next(createError(BAD_REQUEST, 'Please enter email and password'));
  }

  return User.find({ where: { email } })
    .then(user => user || Promise.reject(createError(NOT_FOUND, 'User does not exist')))
    .then(user => user.authenticate(password))
    .then(user => user || Promise.reject(createError(NOT_FOUND, 'Wrong password')))
    .then(user => {
      const token = user.createToken({ expiresIn: '5 days' });
      res.jsend.success({ token, user });
    })
    .catch(err => next(err));
}

module.exports = {
  login
};
