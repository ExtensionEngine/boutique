'use strict';

const { Model } = require('sequelize');

class EnrollmentOffering extends Model {
  static fields({ DATE }) {
    return {
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

  static associate({ ContentRepo, Program }) {
    this.belongsTo(Program, {
      as: 'program',
      foreignKey: { name: 'programId', field: 'program_id' }
    });
    this.belongsTo(ContentRepo, {
      as: 'repository',
      foreignKey: { name: 'repositoryId', field: 'repository_id' }
    });
  }

  static options() {
    return {
      modelName: 'enrollmentOffering',
      tableName: 'enrollment_offering',
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }
}

module.exports = EnrollmentOffering;
