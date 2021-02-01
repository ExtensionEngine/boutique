'use strict';

const { Model } = require('sequelize');
const { restoreOrCreate } = require('../common/database/restore');
const { Role } = require('../../common/config');

class UserGroupMember extends Model {
  static fields({ DATE, ENUM, INTEGER }) {
    return {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      userId: {
        type: INTEGER,
        field: 'user_id'
      },
      userGroupId: {
        type: INTEGER,
        field: 'user_group_id'
      },
      role: {
        type: ENUM(Object.values(Role)),
        defaultValue: Role.LEARNER
      },
      createdAt: {
        type: DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DATE,
        field: 'updated_at'
      },
      deletedAt: {
        type: DATE,
        field: 'deleted_at'
      }
    };
  }

  static associate({ User, UserGroup }) {
    this.belongsTo(User, {
      foreignKey: { name: 'userId', field: 'user_id' }
    });
    this.belongsTo(UserGroup, {
      foreignKey: { name: 'userGroupId', field: 'user_group_id' }
    });
  }

  static options() {
    return {
      modelName: 'userGroupMember',
      tableName: 'user_group_member',
      underscored: true,
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }

  static scopes({ User }) {
    return {
      user: options => ({ include: { model: User, ...options } })
    };
  }

  static withUser(options = {}) {
    const defaultAttrs = ['id', 'email', 'firstName', 'lastName', 'fullName', 'label'];
    if (!options.attributes) options.attributes = defaultAttrs;
    return this.scope({ method: ['user', options] });
  }

  static async restoreOrCreate(userGroupMember, options) {
    return restoreOrCreate(this, userGroupMember, options);
  }
}

module.exports = UserGroupMember;
