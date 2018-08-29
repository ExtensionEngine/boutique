'use strict';

const { Model } = require('sequelize');

class Course extends Model {
  static fields(DataTypes) {
    return {
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { notEmpty: true },
        field: 'course_id'
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { notEmpty: false, len: [2, 255] }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: { notEmpty: false, len: [2, 2000] }
      },
      schema: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { notEmpty: false, len: [2, 255] }
      },
      structure: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: { notEmpty: false, len: [2, 2000] }
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

  static associate({ ProgramLevel }) {
    this.belongsTo(ProgramLevel, {
      as: 'programLevel',
      foreignKey: { name: 'programLevelId', field: 'program_level_id' }
    });
  }

  static options() {
    return {
      modelName: 'course',
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }
}

module.exports = Course;
