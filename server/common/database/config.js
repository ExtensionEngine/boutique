'use strict';

require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  url: process.env.DATABASE_URI,
  dialect: 'postgres',
  operatorsAliases: false,
  migrationStorageTableName: 'sequelize_meta',
  // TODO: Use bunyan for SQL logging.
  benchmark: !isProduction
};
