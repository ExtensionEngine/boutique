'use strict';

const { createLogger, Level } = require('../logger');
const { renderHtml, renderText } = require('./render');
const { email: config } = require('../../config');
const path = require('path');
const pick = require('lodash/pick');
const { promisify } = require('util');
const { SMTPClient } = require('emailjs');
const { URL } = require('url');
const logger = createLogger('mailer', { level: Level.DEBUG });

const from = `${config.sender.name} <${config.sender.address}>`;
const server = new SMTPClient(config);
logger.info(getConfig(server), '📧  SMTP client created');

const send = promisify(server.send.bind(server));
const templatesDir = path.join(__dirname, './templates/');

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
  const data = { href, origin, hostname, recipientName };
  const html = renderHtml(path.join(templatesDir, 'welcome.mjml'), data);
  const text = renderText(path.join(templatesDir, 'welcome.txt'), data);
  logger.info({ recipient, sender: from }, '📧  Sending invite email to:', recipient);
  return send({
    from,
    to: recipient,
    subject: 'Invite',
    text,
    attachment: [{ data: html, alternative: true }]
  });
}

function resetPassword(user, { origin }) {
  const href = resetUrl(origin, user);
  const recipient = user.email;
  const recipientName = user.firstName;
  const data = { href, recipientName };
  const html = renderHtml(path.join(templatesDir, 'reset.mjml'), data);
  const text = renderText(path.join(templatesDir, 'reset.txt'), data);
  logger.info({ recipient, sender: from }, '📧  Sending reset password email to:', recipient);
  return send({
    from,
    to: recipient,
    subject: 'Reset password',
    text,
    attachment: [{ data: html, alternative: true }]
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
