require('dotenv').config();

module.exports = {
  url: process.env.DATABASE_URI,
  dialect: 'postgres',
  operatorsAliases: false
};
