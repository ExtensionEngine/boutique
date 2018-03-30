// TODO: Replace mock with actual implementation!
const bcrypt = require('bcrypt');
const { auth: config = {} } = require('../config');
const find = require('lodash/find');
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

let users = [{
  id: 22,
  name: 'Admin',
  email: 'admin@ntc.com',
  password: 'test123'
}, {
  id: 23,
  name: 'User',
  email: 'user@ntc.com',
  password: 'test456'
}];

class User {
  constructor(data) {
    Object.assign(this, data);
    return encrypt(this.password)
      .then(hash => (this.password = hash))
      .then(() => this);
  }

  static find({ where = {} } = {}) {
    return Promise.resolve(find(users, where));
  }

  static findById(id) {
    return Promise.resolve(find(users, { id }));
  }

  async authenticate(password) {
    const result = await bcrypt.compare(password, this.password);
    return result ? this : false;
  }

  createToken(options = {}) {
    const payload = { id: this.id, email: this.email };
    return jwt.sign(payload, config.secret, options);
  }
}

Promise.map(users, it => new User(it))
  .then(models => (users = models));

module.exports = User;

function encrypt(val) {
  return bcrypt.hash(val, config.saltRounds);
}
