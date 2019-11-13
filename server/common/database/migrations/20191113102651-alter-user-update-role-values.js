'use strict';

const { role: NEW_ROLES } = require('../../../../common/config');
const { default: replaceEnum } = require('sequelize-replace-enum-postgres');

const TABLE_NAME = 'user';
const COLUMN_NAME = 'role';
const ENUM_NAME = `enum_${TABLE_NAME}_${COLUMN_NAME}`;

const OLD_ROLES = { ADMIN: 'ADMIN', STUDENT: 'STUDENT' };
const ROLES = { ...OLD_ROLES, ...NEW_ROLES };

const changeTypeEnum = (queryInterface, newValues) => replaceEnum({
  queryInterface,
  tableName: TABLE_NAME,
  columnName: COLUMN_NAME,
  enumName: ENUM_NAME,
  newValues
});

module.exports = {
  up: async queryInterface => {
    const { sequelize } = queryInterface;
    await changeTypeEnum(queryInterface, Object.values(ROLES));
    await updateType(sequelize, ['LEARNER', 'STUDENT']);
    await changeTypeEnum(queryInterface, Object.values(NEW_ROLES));
  },

  down: async queryInterface => {
    const { sequelize } = queryInterface;
    await changeTypeEnum(queryInterface, Object.values(ROLES));
    await updateType(sequelize, ['STUDENT', 'LEARNER']);
    await changeTypeEnum(queryInterface, Object.values(OLD_ROLES));
  }
};

function updateType(db, replacements) {
  return db.query(`UPDATE "${TABLE_NAME}" SET ${COLUMN_NAME}=? WHERE ${COLUMN_NAME}=?`, { replacements });
}
