'use strict';

const bcrypt = require('bcrypt');
const { auth: config = {} } = require('../../../config');
const Promise = require('bluebird');
const { Role } = require('../../../../common/config');

const times = (length, cb) => Array.from({ length }, (_, i) => cb(i));

const now = new Date();
const users = [{
  first_name: 'Admin',
  last_name: 'Example',
  email: 'admin@example.org',
  password: 'admin123',
  role: Role.ADMIN,
  created_at: now,
  updated_at: now
}];
const LETTER_A_CHAR_CODE = 65;

times(10, i => {
  const suffix = i || '';
  users.push({
    first_name: `User ${String.fromCharCode(LETTER_A_CHAR_CODE + i)}`,
    last_name: 'Example',
    email: `user${suffix}@example.org`,
    password: 'user123',
    role: Role.USER,
    created_at: now,
    updated_at: now
  });
});

module.exports.up = qi => Promise.map(users, user => encryptPassword(user))
  .then(users => qi.bulkInsert('user', users, {}));

module.exports.down = qi => qi.bulkDelete('user', null, {});

async function encryptPassword(user) {
  user.password = await bcrypt.hash(user.password, config.saltRounds);
  return user;
}
