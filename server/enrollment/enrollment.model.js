'use strict';

const { Model } = require('sequelize');
const { restoreOrCreate, restoreOrCreateAll } = require('../common/database/restore');
const map = require('lodash/map');

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

  static associate({ Program, User }) {
    this.belongsTo(Program, {
      as: 'program',
      foreignKey: { name: 'programId', field: 'program_id' }
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

  static async restoreOrCreate(enrollment, options) {
    return restoreOrCreate(this, enrollment, options);
  }

  static async restoreOrCreateAll(enrollments, options) {
    const where = { studentId: map(enrollments, 'studentId') };
    return restoreOrCreateAll(this, enrollments, { where }, options);
  }
}

module.exports = Enrollment;
