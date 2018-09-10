'use strict';

const { Model } = require('sequelize');

class Enrollment extends Model {
  static fields(DataTypes) {
    return {
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

  static associate({ Cohort, User }) {
    this.belongsTo(Cohort, {
      as: 'cohort',
      foreignKey: { name: 'cohortId', field: 'cohort_id' }
    });
    this.belongsTo(User, {
      as: 'student',
      foreignKey: { name: 'studentId', field: 'student_id' }
    });
  }

  static options() {
    return {
      modelName: 'enrollment',
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }
}

module.exports = Enrollment;
