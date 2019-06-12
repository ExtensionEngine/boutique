'use strict';

const { Model } = require('sequelize');
const pick = require('lodash/pick');

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
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: true, len: [2, 255] }
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at'
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: 'deleted_at'
      },
      profile: {
        type: DataTypes.VIRTUAL,
        get() {
          return pick(this,
            ['id', 'name', 'description', 'createdAt', 'deletedAt']);
        }
      }
    };
  }

  static associate({ User }) {
    this.hasMany(User);
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
