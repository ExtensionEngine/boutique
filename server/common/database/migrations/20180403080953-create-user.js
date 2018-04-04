'use strict';

const { role } = require('../../../../common/config');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('user', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: { isEmail: true, notEmpty: true },
      unique: { msg: 'The specified email address is already in use.' }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: { notEmpty: true, len: [5, 100] }
    },
    role: {
      type: Sequelize.ENUM(role.ADMIN, role.STUDENT),
      defaultValue: role.STUDENT
    },
    firstName: {
      type: Sequelize.STRING,
      field: 'first_name'
    },
    lastName: {
      type: Sequelize.STRING,
      field: 'last_name'
    },
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at',
      allowNull: false
    },
    deletedAt: {
      type: Sequelize.DATE,
      field: 'deleted_at'
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('user')
};
