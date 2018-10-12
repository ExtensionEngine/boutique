'use strict';

const { Model } = require('sequelize');
const { timestamps } = require('../common/database/mixins');

class ContentRepo extends Model {
  static fields(DataTypes) {
    return {
      ...timestamps(DataTypes),
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
        allowNull: false
      },
      publishedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'published_at'
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
      : ContentRepo.update(data, { where: { id }, returning: true })
          .then(([_, rows]) => rows[0]);
  }
}

module.exports = ContentRepo;
