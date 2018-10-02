'use strict';

const { Model } = require('sequelize');

class Cohort extends Model {
  static fields(DataTypes) {
    return {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [2, 255] }
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

  static associate({ Enrollment, ContentRepo }) {
    this.hasOne(Enrollment, {
      foreignKey: { name: 'cohortId', field: 'cohort_id' }
    });
    this.hasMany(ContentRepo, {
      foreignKey: { name: 'cohortId', field: 'cohort_id' }
    });
  }

  static options() {
    return {
      modelName: 'cohort',
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }
}

module.exports = Cohort;
