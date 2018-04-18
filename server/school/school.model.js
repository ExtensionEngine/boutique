'use strict';
const { Model } = require('sequelize');
const { Level, Status, Type } = require('../../common/constants/school');
const states = require('../../common/constants/usStates');

class School extends Model {
  static fields(DataTypes) {
    return {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
      },
      level: {
        type: DataTypes.ENUM(Level.values),
        field: 'level'
      },
      type: {
        type: DataTypes.ENUM(Type.values)
      },
      status: {
        type: DataTypes.ENUM(Status.values)
      },
      state: {
        type: DataTypes.STRING(2),
        validate: { isIn: [Object.keys(states)] }
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
