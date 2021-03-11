'use strict';

const { Model } = require('sequelize');

class Preview extends Model {
  static fields({ DATE, INTEGER, JSONB }) {
    return {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      content: {
        type: JSONB,
        allowNull: false
      },
      createdAt: {
        type: DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DATE,
        field: 'updated_at'
      }
    };
  }

  static options() {
    return {
      tableName: 'preview',
      timestamps: true
    };
  }
}

module.exports = Preview;
