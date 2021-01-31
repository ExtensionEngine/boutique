'use strict';

const { Model, Op, Sequelize, UniqueConstraintError } = require('sequelize');
const Audience = require('../common/auth/audience');
const bcrypt = require('bcrypt');
const castArray = require('lodash/castArray');
const config = require('../config');
const find = require('lodash/find');
const IntervalCache = require('../common/util/interval-cache');
const jwt = require('jsonwebtoken');
const logger = require('../common/logger')();
const mail = require('../common/mail');
const map = require('lodash/map');
const pick = require('lodash/pick');
const Promise = require('bluebird');
const { role } = require('../../common/config');
const { sql } = require('../common/database/helpers');
const values = require('lodash/values');

const activityLookup = new IntervalCache(config.userActivity);
Object.values(IntervalCache.EVENTS).forEach(event => {
  activityLookup.on(event, (id, date) => User.updateActivity(id, date));
});

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
        defaultValue: role.LEARNER
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
      lastActive: {
        type: DataTypes.DATE,
        field: 'last_active'
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
          const profile = pick(this, [
            'id', 'firstName', 'lastName', 'email',
            'role', 'createdAt', 'deletedAt'
          ]);
          profile.lastActive = activityLookup.get(this.id) || this.lastActive;
          return profile;
        }
      }
    };
  }

  static get text() {
    return sql.concat(
      Sequelize.col('email'),
      Sequelize.col('first_name'),
      Sequelize.col('last_name'),
      { separator: ' ' }
    );
  }

  static associate({ Enrollment }) {
    this.hasMany(Enrollment, {
      foreignKey: { name: 'learnerId', field: 'learner_id' }
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
      },
      beforeDestroy(user) {
        activityLookup.remove(user.id);
      }
    };
  }

  static scopes() {
    return {
      searchByPattern(pattern) {
        const cond = { [Op.iLike]: `%${pattern}%` };
        const where = sql.where(this.text, cond, { scope: true });
        return { where };
      }
    };
  }

  static match(pattern) {
    if (!pattern) return User;
    return User.scope({ method: ['searchByPattern', pattern] });
  }

  static async invite(user, options) {
    user.token = user.createToken({
      audience: Audience.Scope.Setup,
      expiresIn: '5 days'
    });
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
    return errors;
  }

  static async restoreOrBuild(users, { concurrency = 16 } = {}) {
    users = castArray(users);
    const where = { email: map(users, 'email') };
    const found = await User.findAll({ where, paranoid: false });
    return Promise.map(users, userData => Promise.try(() => {
      const user = find(found, { email: userData.email });
      if (user && !user.deletedAt) {
        const message = this.rawAttributes.email.unique.msg;
        throw new UniqueConstraintError({ message });
      }
      if (user) {
        user.setDataValue('deletedAt', null);
        return user;
      }
      return this.build(userData);
    }).reflect(), { concurrency });
  }

  static updateActivity(id, lastActive) {
    return this.update({ lastActive }, { where: { id } });
  }

  logActivity() {
    activityLookup.set(this.id, new Date());
  }

  async encryptPassword() {
    if (!this.password) return;
    this.password = await bcrypt.hash(this.password, config.auth.saltRounds);
    return this;
  }

  async authenticate(password) {
    const result = await bcrypt.compare(password, this.password);
    return result && this;
  }

  sendResetToken(options) {
    this.token = this.createToken({
      audience: Audience.Scope.Setup,
      expiresIn: '5 days'
    });
    mail.resetPassword(this, options).catch(err =>
      logger.error('Error: Sending reset password email failed:', err.message));
    return this.save();
  }

  createToken(options = {}) {
    const payload = pick(this, ['id', 'email']);
    return jwt.sign(payload, config.auth.secret, options);
  }

  isAdmin() {
    return this.role === role.ADMIN;
  }
}

module.exports = User;
