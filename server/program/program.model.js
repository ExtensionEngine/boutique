'use strict';

const { Model, Op } = require('sequelize');

class Program extends Model {
  static fields({ DATE, STRING }) {
    return {
      name: {
        type: STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: true, len: [2, 255] },
        set(value = '') {
          return this.setDataValue('name', value.trim());
        }
      },
      startDate: {
        type: DATE,
        field: 'start_date',
        validate: { isDate: true }
      },
      endDate: {
        type: DATE,
        field: 'end_date',
        validate: { isDate: true }
      },
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

  static associate({ EnrollmentOffering, ContentRepo }) {
    this.hasOne(EnrollmentOffering, {
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

  static scopes() {
    return {
      active() {
        const currentDate = new Date();
        const startDate = { [Op.or]: { [Op.lt]: currentDate, [Op.eq]: null } };
        const endDate = { [Op.or]: { [Op.gt]: currentDate, [Op.eq]: null } };
        const where = { startDate, endDate };
        return { where };
      }
    };
  }

  static active() {
    return this.scope('active');
  }
}

module.exports = Program;
