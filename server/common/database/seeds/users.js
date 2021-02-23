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
    first_name: `Learner ${String.fromCharCode(LETTER_A_CHAR_CODE + i)}`,
    last_name: 'Example',
    email: `learner${suffix}@example.org`,
    password: 'learner123',
    role: Role.LEARNER,
    created_at: now,
    updated_at: now
  });
});

module.exports = {
  up(queryInterface) {
    return Promise.map(users, user => encryptPassword(user))
      .then(users => queryInterface.bulkInsert('user', users, {}));
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('user', null, {});
  }
};

function encryptPassword(user) {
  return bcrypt.hash(user.password, config.saltRounds)
    .then(password => (user.password = password))
    .then(() => user);
}
