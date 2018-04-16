'use strict';

const { Model } = require('sequelize');

class District extends Model {
  static fields(DataTypes) {
    return {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
      },
      type: {
        type: DataTypes.INTEGER
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
      }
    };
  }

  static options() {
    return {
      modelName: 'district',
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }
}

module.exports = District;
