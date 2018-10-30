'use strict';

const { auth: config = {} } = require('../config');
const { Model, UniqueConstraintError } = require('sequelize');
const { role } = require('../../common/config');
const bcrypt = require('bcrypt');
const castArray = require('lodash/castArray');
const find = require('lodash/find');
const jwt = require('jsonwebtoken');
const logger = require('../common/logger')();
const mail = require('../common/mail');
const map = require('lodash/map');
const pick = require('lodash/pick');
const Promise = require('bluebird');
const Role = require('../../common/config/role');
const values = require('lodash/values');

const pSettle = input => Promise.resolve(input).reflect();
const pSettleMap = (iterable, mapper, options) => {
  return Promise.map(iterable, (...args) => pSettle(mapper(...args)), options);
};

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
        validate: { notEmpty: true, len: [5, 255] }
      },
      role: {
        type: DataTypes.ENUM(values(role)),
        allowNull: false,
        defaultValue: role.STUDENT
      },
      token: {
        type: DataTypes.STRING,
        validate: { notEmpty: true, len: [10, 500] }
      },
      firstName: {
        type: DataTypes.STRING,
        field: 'first_name'
      },
      lastName: {
        type: DataTypes.STRING,
        field: 'last_name'
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at'
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: 'deleted_at'
      },
      profile: {
        type: DataTypes.VIRTUAL,
        get() {
          return pick(this,
            ['id', 'firstName', 'lastName', 'email', 'role', 'createdAt']);
        }
      }
    };
  }

  static associate({ Enrollment }) {
    this.hasMany(Enrollment, {
      foreignKey: { name: 'studentId', field: 'student_id' }
    });
  }

  static options() {
    return {
      modelName: 'user',
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }

  static hooks() {
    return {
      beforeCreate(user) {
        return user.encryptPassword();
      },
      beforeUpdate(user) {
        return user.changed('password')
          ? user.encryptPassword()
          : Promise.resolve(user);
      },
      beforeBulkCreate(users) {
        return Promise.map(users, user => user.encryptPassword());
      }
    };
  }

  static async invite(user, options) {
    user.token = user.createToken({ expiresIn: '3 days' });
    mail.invite(user, options).catch(err =>
      logger.error('Error: Sending invite email failed:', err.message));
    return user.save({ paranoid: false });
  }

  static async import(users, { concurrency = 16, ...options } = {}) {
    const errors = [];
    await this.restoreOrBuild(users, { concurrency }).map((result, i) => {
      if (result.isFulfilled()) return this.invite(result.value(), options);
      const { message = 'Failed to import user.' } = result.reason();
      errors.push({ ...users[i], message });
    }, { concurrency });
    return errors.length && errors;
  }

  static async restoreOrBuild(users, { concurrency = 16 } = {}) {
    users = castArray(users);
    const where = { email: map(users, 'email') };
    const found = await User.findAll({ where, paranoid: false });
    return pSettleMap(users, userData => {
      const user = find(found, { email: userData.email });
      if (user && !user.deletedAt) {
        const message = this.attributes.email.unique.msg;
        return Promise.reject(new UniqueConstraintError({ message }));
      }
      if (user) {
        user.setDataValue('deleteAt', null);
        return user;
      }
      return this.build(userData);
    }, { concurrency });
  }

  async encryptPassword() {
    if (!this.password) return;
    this.password = await bcrypt.hash(this.password, config.saltRounds);
    return this;
  }

  async authenticate(password) {
    const result = await bcrypt.compare(password, this.password);
    return result && this;
  }

  sendResetToken(options) {
    this.token = this.createToken({ expiresIn: '5 days' });
    mail.resetPassword(this, options).catch(err =>
      logger.error('Error: Sending reset password email failed:', err.message));
    return this.save();
  }

  createToken(options = {}) {
    const payload = pick(this, ['id', 'email']);
    return jwt.sign(payload, config.secret, options);
  }

  isAdmin() {
    return this.role === Role.ADMIN;
  }
}

module.exports = User;
