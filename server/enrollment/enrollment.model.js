'use strict';

const { Model, UniqueConstraintError } = require('sequelize');
const castArray = require('lodash/castArray');
const find = require('lodash/find');
const Promise = require('bluebird');

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
      foreignKey: { name: 'learnerId', field: 'student_id' }
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

  static async restoreOrCreate(studentIds, programId, { concurrency = 16 } = {}) {
    studentIds = castArray(studentIds);
    const where = { learnerId: studentIds, programId };
    const found = await this.findAll({ where, paranoid: false });
    return Promise.map(studentIds, learnerId => Promise.try(() => {
      const enrollment = find(found, { learnerId });
      if (enrollment && !enrollment.deletedAt) {
        const message = 'Enrollment already exists!';
        throw new UniqueConstraintError({ message });
      }
      if (enrollment) {
        enrollment.setDataValue('deletedAt', null);
        return enrollment.save();
      }
      return this.create({ learnerId, programId });
    }).reflect(), { concurrency });
  }
}

module.exports = Enrollment;
