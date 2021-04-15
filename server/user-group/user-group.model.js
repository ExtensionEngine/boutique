'use strict';

const find = require('lodash/find');
const hooks = require('./hooks');
const { Model } = require('sequelize');
const { restoreOrCreate } = require('../common/database/restore');

class UserGroup extends Model {
  static fields({ DATE, INTEGER, STRING }) {
    return {
      parentId: {
        type: INTEGER,
        field: 'parent_id'
      },
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

  static associate(opts) {
    const { EnrollmentOffering, OfferingUserGroup, User, UserGroupMembership } = opts;
    this.belongsToMany(User, {
      as: 'members',
      through: UserGroupMembership,
      foreignKey: { name: 'userGroupId', field: 'user_group_id' }
    });
    this.belongsToMany(EnrollmentOffering, {
      through: OfferingUserGroup,
      foreignKey: { name: 'userGroupId', field: 'user_group_id' }
    });
    this.belongsTo(this, {
      as: 'parent',
      foreignKey: { name: 'parentId', field: 'parent_id' }
    });
    this.hasMany(this, {
      as: 'children',
      foreignKey: { name: 'parentId', field: 'parent_id' }
    });
  }

  static options() {
    return {
      modelName: 'userGroup',
      tableName: 'user_group',
      underscored: true,
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }

  static hooks(Hooks, models) {
    hooks.add(this, Hooks, models);
  }

  static async restoreOrCreate(userGroup, options) {
    return restoreOrCreate(this, userGroup, options);
  }

  static async hasAncestorInstructor(user, currentItem, items = [currentItem]) {
    const parent = await this.getParent(currentItem);
    if (!parent) return;
    items.push(parent);
    const { userGroupMembership } = find(parent.members, { id: user.id }) || {};
    const isUserInstructor = userGroupMembership && userGroupMembership.isInstructor();
    return isUserInstructor || this.hasAncestorInstructor(user, parent, items);
  }

  static getParent({ parentId }) {
    const attributes = ['id', 'parentId'];
    const User = this.sequelize.model('User');
    const include = [{ model: User, as: 'members', attributes: ['id'] }];
    return this.findByPk(parentId, { attributes, include });
  }
}

module.exports = UserGroup;
