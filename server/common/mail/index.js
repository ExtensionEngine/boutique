'use strict';

const { createLogger, Level } = require('../logger');
const { email: config } = require('../../config');
const { promisify } = require('util');
const { URL } = require('url');
const email = require('emailjs');
const logger = createLogger('mailer', { level: Level.DEBUG });
const pick = require('lodash/pick');
const path = require('path');
const renderTemplate = require('./templates');

const from = `${config.sender.name} <${config.sender.address}>`;
const server = email.server.connect(config);
logger.info(getConfig(server), '📧  SMTP client created');

const send = promisify(server.send.bind(server));

const resetUrl = (origin, user) => `${origin}/#/auth/reset-password/${user.token}`;

module.exports = {
  send,
  invite,
  resetPassword
};

function invite(user, { origin }) {
  const href = resetUrl(origin, user);
  const { hostname } = new URL(href);
  const recipient = user.email;
  const recipientName = user.firstName;
  const message = renderTemplate(
    path.join(__dirname, '/templates/assets/welcome.mjml'),
    { href, origin, hostname, recipientName }
  );
  logger.info({ recipient, sender: from }, '📧  Sending invite email to:', recipient);
  return send({
    from,
    to: recipient,
    subject: 'Invite',
    attachment: [{ data: `<html>${message}</html>`, alternative: true }]
  });
}

function resetPassword(user, { origin }) {
  const href = resetUrl(origin, user);
  const recipient = user.email;
  const recipientName = user.firstName;
  const message = renderTemplate(
    path.join(__dirname, '/templates/assets/reset.mjml'),
    { href, recipientName }
  );
  logger.info({ recipient, sender: from }, '📧  Sending reset password email to:', recipient);
  return send({
    from,
    to: recipient,
    subject: 'Reset password',
    attachment: [{ data: `<html>${message}</html>`, alternative: true }]
  });
}

function getConfig(server) {
  // NOTE: List public keys: https://git.io/fxV4j
  return pick(server.smtp, [
    'host', 'port', 'domain',
    'authentication', 'ssl', 'tls',
    'timeout'
  ]);
}
