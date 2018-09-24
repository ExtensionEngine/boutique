'use strict';

const { email: config } = require('../config');
const { parse: parseUrl } = require('url');
const { promisify } = require('util');
const { role } = require('../../common/config');
const email = require('emailjs');

const from = `${config.sender.name} <${config.sender.address}>`;
const server = email.server.connect(config);
const send = promisify(server.send.bind(server));
const isAdmin = user => user.role && user.role === role.ADMIN;

module.exports = {
  send,
  invite,
  resetPassword
};

function invite(user, { origin }) {
  const href = resetUrl(origin, user);
  const { hostname } = parseUrl(href);
  const message = `
    An account has been created for you on ${hostname}.
    Please click <a href="${href}">here</a> to complete your registration.`;

  return send({
    from,
    to: user.email,
    subject: 'Invite',
    attachment: [{ data: `<html>${message}</html>`, alternative: true }]
  });
}

function resetPassword(user, { origin }) {
  const href = resetUrl(origin, user);
  const message = `
    You requested password reset.
    Please click <a href="${href}">here</a> to complete the reset process.`;

  return send({
    from,
    to: user.email,
    subject: 'Reset password',
    attachment: [{ data: `<html>${message}</html>`, alternative: true }]
  });
}

function resetUrl(origin, user) {
  const baseUrl = origin + (isAdmin(user) ? '/admin' : '');
  return `${baseUrl}/#/auth/reset-password/${user.token}`;
}
