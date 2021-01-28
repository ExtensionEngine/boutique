'use strict';

const { role: roles } = require('../../../../common/config');

const TABLE_NAME = 'group_user';

exports.up = async (qi, Sequelize) => {
  await qi.createTable(TABLE_NAME, getColumns(Sequelize));
  return addConstraints(qi);
};

exports.down = qi => qi.dropTable(TABLE_NAME);

const getColumns = ({ DATE, ENUM, INTEGER }) => ({
  userId: {
    type: INTEGER,
    field: 'user_id',
    references: { model: 'user', key: 'id' },
    allowNull: false
  },
  groupId: {
    type: INTEGER,
    field: 'group_id',
    references: { model: 'group', key: 'id' },
    allowNull: false
  },
  role: {
    type: ENUM(Object.values(roles))
  },
  createdAt: {
    type: DATE,
    field: 'created_at',
    allowNull: false
  },
  updatedAt: {
    type: DATE,
    field: 'updated_at',
    allowNull: false
  },
  deletedAt: {
    type: DATE,
    field: 'deleted_at'
  }
});

async function addConstraints(qi) {
  const table = await qi.describeTable(TABLE_NAME);
  if (table.group_id.primaryKey && table.user_id.primaryKey) return;
  const fields = ['group_id', 'user_id'];
  const options = { name: 'group_user_pkey', type: 'primary key', fields };
  return qi.addConstraint(TABLE_NAME, options);
}
