'use strict';

const bcrypt = require('bcrypt');
const { auth: config = {} } = require('../../../config');
const { role } = require('../../../../common/config');

const now = new Date();
const users = [{
  first_name: 'Admin',
  last_name: 'Example',
  email: 'admin@example.org',
  password: 'admin123',
  role: role.ADMIN,
  created_at: now,
  updated_at: now
}, {
  first_name: 'Student',
  last_name: 'Example',
  email: 'student@example.org',
  password: 'student123',
  role: role.STUDENT,
  created_at: now,
  updated_at: now
}];

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all(users.map(it => encryptPassword(it)))
      .then(users => queryInterface.bulkInsert('user', users, {}));
  },
  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user', null, {});
  }
};

function encryptPassword(user) {
  return bcrypt.hash(user.password, config.saltRounds)
    .then(password => (user.password = password))
    .then(() => user);
}
