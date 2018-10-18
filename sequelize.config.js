require('dotenv').config();
const path = require('path');

module.exports = {
  config: path.join(__dirname, './server/common/database/config.js'),
  seedersPath: path.join(__dirname, './server/common/database/seeds'),
  migrationsPath: path.join(__dirname, './server/common/database/migrations')
};
