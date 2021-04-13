'use strict';

const { Model } = require('sequelize');
const { restoreOrCreate } = require('../common/database/restore');

class OfferingUserGroup extends Model {
  static fields({ DATE, INTEGER }) {
    return {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      userGroupId: {
        type: INTEGER,
        field: 'user_group_id'
      },
      offeringId: {
        type: INTEGER,
        field: 'offering_id'
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

  static associate({ UserGroup, EnrollmentOffering }) {
    this.belongsTo(UserGroup, {
      foreignKey: { name: 'userGroupId', field: 'user_group_id' }
    });
    this.belongsTo(EnrollmentOffering, {
      foreignKey: { name: 'offeringId', field: 'offering_id' }
    });
  }

  static options() {
    return {
      modelName: 'offeringUserGroup',
      tableName: 'offering_user_group',
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }

  static async restoreOrCreate(offeringUserGroup, options) {
    return restoreOrCreate(this, offeringUserGroup, options);
  }
}

module.exports = OfferingUserGroup;
