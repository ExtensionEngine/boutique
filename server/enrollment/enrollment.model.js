'use strict';

const { restoreOrCreate, restoreOrCreateAll } = require('../common/database/restore');
const map = require('lodash/map');
const { Model } = require('sequelize');

class Enrollment extends Model {
  static fields({ DATE }) {
    return {
      createdAt: {
        type: DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DATE,
        field: 'updated_at'
      },
      deletedAt: {
        type: DATE,
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
      as: 'learner',
      foreignKey: { name: 'learnerId', field: 'learner_id' }
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
    const where = { learnerId: map(enrollments, 'learnerId') };
    return restoreOrCreateAll(this, enrollments, { where }, options);
  }
}

module.exports = Enrollment;
