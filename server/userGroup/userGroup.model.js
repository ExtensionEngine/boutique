'use strict';

const { Model } = require('sequelize');
const { restoreOrCreate } = require('../common/database/restore');

class UserGroup extends Model {
  static fields({ DATE, STRING }) {
    return {
      name: {
        type: STRING
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

  static associate({ User, UserGroupMembers }) {
    this.belongsToMany(User, {
      as: 'members',
      through: UserGroupMembers,
      foreignKey: { name: 'userGroupId', field: 'user_group_id' }
    });
  }

  static options() {
    return {
      modelName: 'userGroup',
      tableName: 'user_group',
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }

  static async restoreOrCreate(userGroup, options) {
    return restoreOrCreate(this, userGroup, options);
  }
}

module.exports = UserGroup;
