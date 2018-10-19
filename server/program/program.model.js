'use strict';

const { Model } = require('sequelize');

class Program extends Model {
  static fields(DataTypes) {
    return {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [2, 255] }
      },
      startDate: {
        type: DataTypes.DATE,
        field: 'start_date',
        validate: { isDate: true }
      },
      endDate: {
        type: DataTypes.DATE,
        field: 'end_date',
        validate: { isDate: true }
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
      freezeTableName: true,
      validate: {
        endDateIsAfterStartDate() {
          if (!this.endDate) return;
          if (new Date(this.startDate) >= new Date(this.endDate)) {
            throw new Error('The End Date must be after Start Date.');
          }
        },
        endDateRequiresStartDate() {
          if (this.endDate && !this.startDate) {
            throw new Error('The End Date requires Start Date.');
          }
        }
      }
    };
  }
}

module.exports = Program;
