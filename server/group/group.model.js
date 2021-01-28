'use strict';

const { Model } = require('sequelize');
const { restoreOrBuild } = require('../common/database/restore');

class Group extends Model {
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

  static associate({ GroupUser, User }) {
    this.belongsToMany(User, {
      through: GroupUser,
      foreignKey: { name: 'groupId', field: 'group_id' }
    });
  }

  static async restoreOrBuild(group, options) {
    return restoreOrBuild(this, group, options);
  }

  static options() {
    return {
      modelName: 'group',
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }
}

module.exports = Group;
