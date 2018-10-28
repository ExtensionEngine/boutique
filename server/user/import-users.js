'use strict';

const find = require('lodash/find');
const pick = require('lodash/pick');
const Promise = require('bluebird');

const inputAttrs = ['email', 'role', 'firstName', 'lastName'];

class ImportErrors {
  constructor() {
    this.errors = [];
  }

  add(user, message) {
    this.errors.push({ user, message });
  }

  get() {
    const userAttrs = ['email', 'firstName', 'lastName'];
    return this.errors.map(({ user, message }) => ({
      ...pick(user, userAttrs),
      message
    }));
  }
}

module.exports = User => async (users, { origin } = {}) => {
  const existingUsers = await User.findAll({
    where: { email: users.map(user => user.email) },
    paranoid: false
  });
  const errors = new ImportErrors();
  await Promise.map(users, user => {
    const existingUser = find(existingUsers, user);
    if (existingUser && !existingUser.deletedAt) {
      return errors.add(user, 'User already exists!');
    }
    return User.invite(pick(user, inputAttrs), { existingUser, origin })
      .catch(err => errors.add(user, err.message));
  });
  return errors.get().length && errors.get();
};
