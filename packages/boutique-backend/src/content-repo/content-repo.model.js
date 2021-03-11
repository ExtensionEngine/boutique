'use strict';

const { Model } = require('sequelize');

class ContentRepo extends Model {
  static fields({ DATE, INTEGER, JSONB, STRING, TEXT, UUID }) {
    return {
      sourceId: {
        type: INTEGER,
        allowNull: false,
        field: 'source_id'
      },
      uid: {
        type: UUID,
        allowNull: false,
        validate: { isUUID: 'all' }
      },
      schema: {
        type: STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [2, 20] }
      },
      name: {
        type: STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [2, 250] }
      },
      description: {
        type: TEXT,
        allowNull: false,
        validate: { notEmpty: true, len: [2, 2000] }
      },
      structure: {
        type: JSONB,
        allowNull: false
      },
      publishedAt: {
        type: DATE,
        allowNull: false,
        field: 'published_at'
      },
      createdAt: {
        type: DATE,
        allowNull: false,
        field: 'created_at'
      },
      updatedAt: {
        type: DATE,
        allowNull: false,
        field: 'updated_at'
      },
      deletedAt: {
        type: DATE,
        field: 'deleted_at'
      }
    };
  }

  static associate({ Program }) {
    this.belongsTo(Program, {
      foreignKey: { name: 'programId', field: 'program_id' }
    });
  }

  static options() {
    return {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'content_repo'
    };
  }

  static createOrUpdate(id, data) {
    return !id
      ? ContentRepo.create(data)
      : ContentRepo.update(data, { where: { id }, returning: true, paranoid: false })
          .then(([_, rows]) => rows[0].restore());
  }
}

module.exports = ContentRepo;
