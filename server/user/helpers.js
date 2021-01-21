'use strict';

const { role } = require('../../common/config');
const times = require('lodash/times');

function generate() {
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

module.exports = { generate };
