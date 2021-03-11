'use strict';

require('dotenv').config();
const path = require('path');

module.exports = {
  config: path.join(__dirname, './src/common/database/config.js'),
  seedersPath: path.join(__dirname, './src/common/database/seeds'),
  migrationsPath: path.join(__dirname, './src/common/database/migrations')
};
