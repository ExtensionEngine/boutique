'use strict';

const { Model } = require('sequelize');
const { role: roles } = require('../../common/config');

class GroupUser extends Model {
  static fields({ DATE, ENUM, INTEGER }) {
    return {
      userId: {
        type: INTEGER,
        field: 'user_id',
        primaryKey: true,
        unique: 'group_user_pkey'
      },
      groupId: {
        type: INTEGER,
        field: 'group_id',
        primaryKey: true,
        unique: 'group_user_pkey'
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

  static associate({ User }) {
    this.belongsTo(User, {
      foreignKey: { name: 'userId', field: 'user_id' }
    });
  }

  static options() {
    return {
      modelName: 'groupUser',
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }
}

module.exports = GroupUser;
