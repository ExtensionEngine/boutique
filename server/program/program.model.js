'use strict';

const { Model, Sequelize } = require('sequelize');
const trim = require('lodash/trim');

const { Op } = Sequelize;
class Program extends Model {
  static fields(DataTypes) {
    return {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: true, len: [2, 255] },
        set(value) { this.setDataValue('name', trim(value)); }
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
        async isProgramNameUnique() {
          const where = { name: { [Op.iLike]: this.name } };
          if (this.id) where.id = { [Op.not]: this.id };
          const program = await Program.findOne({ where });
          if (program) {
            throw new Error(`Program named ${program.name} already exists.`);
          }
        },
        endDateRequiresStartDate() {
          if (this.endDate && !this.startDate) {
            throw new Error('The End Date requires Start Date.');
          }
        },
        endDateIsAfterStartDate() {
          if (!this.endDate) return;
          if (new Date(this.startDate) >= new Date(this.endDate)) {
            throw new Error('The End Date must be after Start Date.');
          }
        }
      }
    };
  }
}

module.exports = Program;
