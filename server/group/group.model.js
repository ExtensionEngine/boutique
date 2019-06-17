'use strict';

const { Model } = require('sequelize');

class Group extends Model {
  static fields(DataTypes) {
    return {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: true, len: [2, 50] }
      },
      description: {
        type: DataTypes.STRING
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
        allowNull: false
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: 'deleted_at'
      }
    };
  }

  static associate({ User }) {
    this.hasMany(User, {
      foreignKey: { name: 'groupId', field: 'group_id' }
    });
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
