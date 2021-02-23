'use strict';

const Datasheet = require('./datasheet');
const mime = require('mime');
const { role } = require('../../common/config');

const times = (length, cb) => Array.from({ length }, (_, i) => cb(i));

function generateUsers() {
  const users = [{
    firstName: 'Admin',
    lastName: 'Example',
    email: 'admin@example.org',
    role: role.ADMIN
  }];
  times(10, i => {
    const suffix = i || '';
    users.push({
      firstName: `Learner ${suffix}`,
      lastName: 'Example',
      email: `learner${suffix}@example.org`,
      role: role.LEARNER
    });
  });
  return users;
}

function createSheet({ sheet, body, file = {} }, res) {
  const creator = 'Boutique';
  const report = (new Datasheet(sheet)).toWorkbook({ creator });
  const format = body.format || mime.getExtension(file.mimetype) || 'xlsx';
  return report.send(res, { format });
}

module.exports = { createSheet, generateUsers };
