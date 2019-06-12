'use strict';
const Promise = require('bluebird');
const TABLE_NAME = 'group';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction => {
      return queryInterface.createTable(TABLE_NAME, {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.STRING(50),
          allowNull: false
        },
        description: {
          type: Sequelize.STRING(255),
          field: 'description',
          allowNull: false
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
      }, { transaction })
      .then(() => {
        return queryInterface.addColumn('user', 'group_id', {
          type: Sequelize.INTEGER,
          references: { model: TABLE_NAME, key: 'id' },
          onDelete: 'NO ACTION',
          allowNull: true
        }, { transaction });
      });
    });
  },
  down: queryInterface => {
    return queryInterface.sequelize.transaction(transaction => {
      const migrations = [
        queryInterface.removeColumn('user', 'group_id', { transaction }),
        queryInterface.dropTable(TABLE_NAME, { transaction })
      ];
      return Promise.each(migrations, migration => migration);
    });
  }
};
