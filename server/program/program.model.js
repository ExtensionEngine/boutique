'use strict';

const { Model } = require('sequelize');
const { timestamps } = require('../common/database/mixins');

class Program extends Model {
  static fields(DataTypes) {
    return {
      ...timestamps(DataTypes),
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [2, 255] }
      }
    };
  }

  static associate({ Enrollment, ContentRepo }) {
    this.hasOne(Enrollment, {
      foreignKey: { name: 'programId', field: 'program_id' }
    });
    this.hasMany(ContentRepo, {
      foreignKey: { name: 'programId', field: 'program_id' }
    });
  }

  static options() {
    return {
      modelName: 'program',
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }
}

module.exports = Program;
