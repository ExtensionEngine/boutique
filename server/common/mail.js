'use strict';

const { email: config } = require('../config');
const { parse: parseUrl } = require('url');
const { promisify } = require('util');
const { role } = require('../../common/config');
const email = require('emailjs');
const fs = require('fs');
const path = require('path');
const pupa = require('pupa');

const server = email.server.connect(config);
const send = promisify(server.send.bind(server));
const isAdmin = user => user.role && user.role === role.ADMIN;
const baseEmailTemplate = fs.readFileSync(
  path.join(__dirname, './mail-templates/base.html'),
  'utf-8'
);

module.exports = {
  send,
  invite,
  resetPassword
};

function invite(user, { origin }) {
  const href = resetUrl(origin, user);
  const { hostname } = parseUrl(href);
  const message = pupa(baseEmailTemplate, {
    title: 'LMS - New User Invitation',
    headerText: 'Welcome!',
    userName: user.firstName,
    bodyText: `
      An account has been created for you on <span style="font-style: italic; font-weight: bold;">${hostname}</span>.
      We're excited to have you here! Before you can get started, you need to complete your registration.
      Please do so by clicking the button below:
    `,
    button: {
      url: href,
      text: 'Confirm Account'
    }
  });

  return send({
    from: `LMS <${config.sender}>`,
    to: user.email,
    subject: 'Invite',
    attachment: [{ data: message, alternative: true }]
  });
}

function resetPassword(user, { origin }) {
  const href = resetUrl(origin, user);
  const message = pupa(baseEmailTemplate, {
    title: 'LMS - Password Reset',
    headerText: 'Password Reset Required',
    userName: user.firstName,
    bodyText: `
      You have requested a password reset. Please click on the button below to complete the process:
    `,
    button: {
      url: href,
      text: 'Reset Password'
    }
  });

  return send({
    from: `LMS <${config.sender}>`,
    to: user.email,
    subject: 'Reset password',
    attachment: [{ data: message, alternative: true }]
  });
}

function resetUrl(origin, user) {
  const baseUrl = origin + (isAdmin(user) ? '/admin' : '');
  return `${baseUrl}/#/auth/reset-password/${user.token}`;
}
