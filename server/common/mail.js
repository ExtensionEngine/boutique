'use strict';

const email = require('emailjs');
const get = require('lodash/get');
const Promise = require('bluebird');

// TODO: Temp, replace ip based config with hostname and update URL
const SERVER_URL = `http://localhost:8081`;
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;

const server = email.server.connect({
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
  host: process.env.EMAIL_HOST,
  ssl: true
});

function send(message) {
  return new Promise((resolve, reject) => {
    server.send(message, (err, msg) => err ? reject(err) : resolve(msg));
  });
}

function invite(user) {
  const link = `${getAppUrl(user)}/#/auth/reset-password/${user.token}`;
  const message = `
    An account has been created for you on ${SERVER_URL}.
    Please click <a href="${link}">here</a> to complete your registration.`;

  return send({
    from: `LMS <${EMAIL_ADDRESS}>`,
    to: user.email,
    subject: 'Invite',
    attachment: [{ data: `<html>${message}</html>`, alternative: true }]
  });
}

function resetPassword(user) {
  const link = `${getAppUrl(user)}/#/auth/reset-password/${user.token}`;
  const message = `
    You requested password reset.
    Please click <a href="${link}">here</a> to complete the reset process.`;

  return send({
    from: `LMS <${EMAIL_ADDRESS}>`,
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

module.exports = {
  send,
  invite,
  resetPassword
};
