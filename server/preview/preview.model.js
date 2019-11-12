'use strict';

const { Model } = require('sequelize');

class Preview extends Model {
  static fields(DataTypes) {
    return {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      content: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at'
      }
    };
  }

  static options() {
    return {
      tableName: 'preview',
      modelName: 'preview',
      timestamps: true,
      freezesTableName: true
    };
  }
}

module.exports = Preview;
