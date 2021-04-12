'use strict';

const { Role } = require('../../common/config');
const times = require('lodash/times');

function generate() {
  const users = [{
    firstName: 'Admin',
    lastName: 'Example',
    email: 'admin@example.org',
    role: Role.ADMIN
  }];
  times(10, i => {
    const suffix = i || '';
    users.push({
      firstName: `User ${suffix}`,
      lastName: 'Example',
      email: `user${suffix}@example.org`,
      role: Role.USER
    });
  });
  return users;
}

module.exports = { generate };
