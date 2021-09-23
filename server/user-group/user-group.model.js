'use strict';

const find = require('lodash/find');
const head = require('lodash/head');
const map = require('lodash/map');
const { Model } = require('sequelize');
const { restoreOrCreate } = require('../common/database/restore');

const rootQuery = id => `
  SELECT id, parent_id
  FROM user_group
  WHERE id = ${id}
`;

const getRootWithDescendantsQuery = id => `
  WITH RECURSIVE group_tree AS (
    ${rootQuery(id)}
    UNION ALL
    SELECT user_group.id, user_group.parent_id
    FROM user_group
    JOIN group_tree ON user_group.parent_id = group_tree.id
  ) SELECT * FROM group_tree`;

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

  static async restoreOrCreate(userGroup, options) {
    return restoreOrCreate(this, userGroup, options);
  }

  static getParent({ parentId }) {
    const attributes = ['id', 'parentId'];
    const User = this.sequelize.model('User');
    const include = [{ model: User, as: 'members', attributes: ['id'] }];
    return this.findByPk(parentId, { attributes, include });
  }

  static async hasAncestorInstructor(user, currentItem, items = [currentItem]) {
    const parent = await this.getParent(currentItem);
    if (!parent) return;
    items.push(parent);
    const { userGroupMembership } = find(parent.members, { id: user.id }) || {};
    const isUserInstructor = userGroupMembership && userGroupMembership.isInstructor();
    return isUserInstructor || this.hasAncestorInstructor(user, parent, items);
  }

  async getRootWithDescendants({ transaction }) {
    const sql = getRootWithDescendantsQuery(this.id);
    const groups = head(await this.sequelize.query(sql, { raw: true, transaction }));
    const User = this.sequelize.model('User');
    const UserGroup = this.sequelize.model('UserGroup');
    return UserGroup.findAll({
      where: { id: map(groups, 'id') },
      include: [{ model: User, as: 'members', attributes: ['id'] }],
      attributes: ['id', 'parentId'],
      transaction
    });
  }

  remove() {
    return this.sequelize.transaction(async transaction => {
      const descendantIds = map(await this.getRootWithDescendants(transaction), 'id');
      return UserGroup.destroy({ where: { id: descendantIds } });
    });
  }
}

module.exports = UserGroup;
