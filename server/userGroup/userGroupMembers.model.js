'use strict';

const { Model } = require('sequelize');
const { restoreOrCreate } = require('../common/database/restore');
const { role: roles } = require('../../common/config');

class UserGroupMembers extends Model {
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
        type: ENUM(Object.values(roles)),
        defaultValue: roles.LEARNER
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
      as: 'member',
      foreignKey: { name: 'userId', field: 'user_id' }
    });
    this.belongsTo(UserGroup, {
      foreignKey: { name: 'userGroupId', field: 'user_group_id' }
    });
  }

  static options() {
    return {
      modelName: 'userGroupMembers',
      tableName: 'user_group_members',
      underscored: true,
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }

  static async restoreOrCreate(userGroupMember, options) {
    return restoreOrCreate(this, userGroupMember, options);
  }
}

module.exports = UserGroupMembers;
