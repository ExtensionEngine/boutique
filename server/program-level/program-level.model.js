'use strict';

const { Model } = require('sequelize');

class ProgramLevel extends Model {
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

  static associate({ Enrollment, Program, ContentRepo }) {
    this.belongsTo(Program, {
      foreignKey: { name: 'programId', field: 'program_id' }
    });
    this.hasMany(Enrollment, {
      foreignKey: { name: 'program_level_id', field: 'program_level_id' }
    });
    this.hasMany(ContentRepo, {
      foreignKey: { name: 'program_level_id', field: 'program_level_id' }
    });
  }

  static options() {
    return {
      modelName: 'program_level',
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }
}

module.exports = ProgramLevel;
