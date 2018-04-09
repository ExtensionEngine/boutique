'use strict';

const { email: config } = require('../config');
const { promisify } = require('util');
const email = require('emailjs');
const get = require('lodash/get');

// TODO: Temp, replace ip based config with hostname and update URL
const SERVER_URL = `http://localhost:8081`;

const server = email.server.connect(config);
const send = promisify(server.send.bind(server));

module.exports = {
  send,
  invite,
  resetPassword
};

function invite(user) {
  const link = `${getAppUrl(user)}/#/reset-password/${user.token}`;
  const message = `
    An account has been created for you on ${SERVER_URL}.
    Please click <a href="${link}">here</a> to complete your registration.`;

  return send({
    from: `LMS <${config.sender}>`,
    to: user.email,
    subject: 'Invite',
    attachment: [{ data: `<html>${message}</html>`, alternative: true }]
  });
}

function resetPassword(user) {
  const link = `${getAppUrl(user)}/#/reset-password/${user.token}`;
  const message = `
    You requested password reset.
    Please click <a href="${link}">here</a> to complete the reset process.`;

  return send({
    from: `LMS <${config.sender}>`,
    to: user.email,
    subject: 'Reset password',
    attachment: [{ data: `<html>${message}</html>`, alternative: true }]
  });
}

function getAppUrl(user) {
  let baseUrl = SERVER_URL;
  if (get(user, 'role', 'STUDENT') !== 'STUDENT') baseUrl += '/admin';
  return baseUrl;
}
