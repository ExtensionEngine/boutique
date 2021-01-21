'use strict';

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
          allowNull: false,
          unique: true
        },
        description: {
          type: Sequelize.STRING,
          field: 'description'
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
          onDelete: 'CASCADE'
        }, { transaction });
      });
    });
  },
  down: queryInterface => {
    return queryInterface.sequelize.transaction(transaction => {
      return queryInterface.removeColumn('user', 'group_id', { transaction })
      .then(() => queryInterface.dropTable(TABLE_NAME, { transaction }));
    });
  }
};
