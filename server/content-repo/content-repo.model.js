'use strict';

const { Model } = require('sequelize');

class ContentRepo extends Model {
  static fields(DataTypes) {
    return {
      sourceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'source_id'
      },
      uid: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: { isUUID: 'all' }
      },
      schema: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [2, 20] }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [2, 250] }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: true, len: [2, 2000] }
      },
      structure: {
        type: DataTypes.JSONB,
        allowNull: false,
        validate: { notEmpty: true }
      },
      publishedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'published_at'
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

  static associate({ ProgramLevel }) {
    this.belongsTo(ProgramLevel, {
      as: 'programLevel',
      foreignKey: { name: 'programLevelId', field: 'program_level_id' }
    });
  }

  static options() {
    return {
      modelName: 'content_repo',
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }
}

module.exports = ContentRepo;
