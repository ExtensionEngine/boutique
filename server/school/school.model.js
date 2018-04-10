'use strict';

const { Model } = require('sequelize');

class School extends Model {
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
      ncesSchoolLevel: {
        type: DataTypes.INTEGER,
        field: 'nces_school_level'
      },
      state: {
        type: DataTypes.STRING,
        validate: { len: [2, 2] }
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

  static associate({ District }) {
    this.belongsTo(District, {
      foreignKey: {
        name: 'districtId',
        field: 'district_id'
      }
    });
  }

  static options() {
    return {
      modelName: 'school',
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }
}

module.exports = School;
