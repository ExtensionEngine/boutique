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
      firstName: `Learner ${suffix}`,
      lastName: 'Example',
      email: `learner${suffix}@example.org`,
      role: Role.LEARNER
    });
  });
  return users;
}

module.exports = { generate };
