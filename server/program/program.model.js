'use strict';

const { Model, Op } = require('sequelize');

class Program extends Model {
  static fields(DataTypes) {
    return {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: true, len: [2, 255] },
        set(value = '') {
          return this.setDataValue('name', value.trim());
        }
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
