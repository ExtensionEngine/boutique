'use strict';

const bcrypt = require('bcrypt');
const { auth: config = {} } = require('../config');
const pick = require('lodash/pick');
const jwt = require('jsonwebtoken');

const { Model } = require('sequelize');

class User extends Model {
  static fields(DataTypes) {
    return {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true, notEmpty: true },
        unique: { msg: 'This email address is already in use.' }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [5, 100] }
      },
      firstName: {
        type: DataTypes.STRING
      },
      lastName: {
        type: DataTypes.STRING
      },
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      },
      deletedAt: {
        type: DataTypes.DATE
      }
    };
  }

  static options() {
    return {
      modelName: 'users',
      timestamps: true,
      paranoid: true
    };
  }

  static hooks() {
    return {
      beforeCreate(user) {
        return user.encryptPassword();
      },
      beforeUpdate(user) {
        if (user.changed('password')) {
          return user.encryptPassword();
        }
      },
      beforeBulkCreate(users) {
        let updates = users.map(user => user.encryptPassword());
        return Promise.all(updates);
      }
    };
  }

  async encryptPassword() {
    this.password = await bcrypt.hash(this.password, config.saltRounds);
    return this;
  }

  async authenticate(password) {
    const result = await bcrypt.compare(password, this.password);
    return result ? this : false;
  }

  createToken(options = {}) {
    const payload = pick(this, ['id', 'email']);
    return jwt.sign(payload, config.secret, options);
  }
}

module.exports = User;
