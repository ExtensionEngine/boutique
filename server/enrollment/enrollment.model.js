'use strict';

const { Model } = require('sequelize');
const { timestamps } = require('../common/database/mixins');

class Enrollment extends Model {
  static fields(DataTypes) {
    return timestamps(DataTypes);
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
}

module.exports = Enrollment;
