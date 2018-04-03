'use strict';

const bcrypt = require('bcrypt');
const { auth: config = {} } = require('../../../config');

const now = new Date();
const usersData = [
  {
    firstName: 'Admin',
    lastName: 'Example',
    email: 'admin@example.org',
    password: 'admin123',
    createdAt: now,
    updatedAt: now
  },
  {
    firstName: 'Student',
    lastName: 'Example',
    email: 'student@example.org',
    password: 'student123',
    createdAt: now,
    updatedAt: now
  }
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const updates = usersData.map(user => encryptPassword(user));
    return Promise.all(updates).then(data => queryInterface.bulkInsert('users', data, {}));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};

function encryptPassword(user) {
  return bcrypt.hash(user.password, config.saltRounds)
    .then(password => (user.password = password))
    .then(() => user);
}
