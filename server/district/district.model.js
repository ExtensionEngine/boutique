'use strict';

const { Model } = require('sequelize');

class District extends Model {
  static fields(DataTypes) {
    return {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
        unique: true
      },
      ncesId: {
        type: DataTypes.INTEGER,
        field: 'nces_id',
        allowNull: false,
        validate: { notEmpty: true },
        unique: true
      },
      ncesType: {
        type: DataTypes.INTEGER,
        field: 'nces_type'
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
