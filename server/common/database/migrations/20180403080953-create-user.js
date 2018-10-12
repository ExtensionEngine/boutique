'use strict';

const { role } = require('../../../../common/config');
const { timestamps } = require('../mixins');
const values = require('lodash/values');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('user', {
    ...timestamps(Sequelize),
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING
    },
    role: {
      type: Sequelize.ENUM(values(role)),
      allowNull: false
    },
    token: {
      type: Sequelize.STRING(500)
    },
    firstName: {
      type: Sequelize.STRING,
      field: 'first_name'
    },
    lastName: {
      type: Sequelize.STRING,
      field: 'last_name'
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('user')
};
