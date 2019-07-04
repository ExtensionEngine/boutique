'use strict';

const { Model, UniqueConstraintError } = require('sequelize');
const find = require('lodash/find');
const Promise = require('bluebird');

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

  static async restoreOrBuild({ name }) {
    const where = { name };
    const found = await Group.findAll({ where, paranoid: false });
    return new Promise((resolve, reject) => {
      const group = find(found, { name });
      if (group && !group.deletedAt) {
        const message = this.attributes.name.unique.msg;
        reject(new UniqueConstraintError({ message }));
      }
      if (group) {
        group.setDataValue('deletedAt', null);
        group.save().then(() => resolve(group));
      }
      resolve(this.build(group));
    });
  }
}

module.exports = Group;
