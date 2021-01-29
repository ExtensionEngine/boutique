'use strict';

const { Model } = require('sequelize');
const { role: roles } = require('../../common/config');

class GroupUser extends Model {
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
      groupId: {
        type: INTEGER,
        field: 'group_id'
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

  static associate({ Group, User }) {
    this.belongsTo(User, {
      foreignKey: { name: 'userId', field: 'user_id' }
    });
    this.belongsTo(Group, {
      foreignKey: { name: 'groupId', field: 'group_id' }
    });
  }

  static options() {
    return {
      modelName: 'groupUser',
      tableName: 'group_user',
      underscored: true,
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }
}

module.exports = GroupUser;
