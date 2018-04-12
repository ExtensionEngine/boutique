'use strict';

const { 'migrations-path': migrationsPath } = require('../../../.sequelizerc');
const config = require('./config');
const forEach = require('lodash/forEach');
const invoke = require('lodash/invoke');
const logger = require('../logger')();
const Sequelize = require('sequelize');
const Umzug = require('umzug');

// Require models.
const District = require('../../district/district.model');
const Program = require('../../program/program.model');
const ProgramLevel = require('../../program-level/program-level.model');
const School = require('../../school/school.model');
const User = require('../../user/user.model');

const isProduction = process.env.NODE_ENV === 'production';
const sequelize = new Sequelize(config.url, config);
const { Sequelize: { DataTypes } } = sequelize;

const defineModel = Model => {
  const fields = invoke(Model, 'fields', DataTypes, sequelize) || {};
  const hooks = invoke(Model, 'hooks') || {};
  const scopes = invoke(Model, 'scopes', sequelize) || {};
  const options = invoke(Model, 'options') || {};
  return Model.init(fields, { sequelize, hooks, scopes, ...options });
};

function initialize() {
  const umzug = new Umzug({
    logging: message => logger.info('[Migration]', message),
    storage: 'sequelize',
    storageOptions: {
      sequelize,
      tableName: config.migrationStorageTableName
    },
    migrations: {
      params: [sequelize.getQueryInterface(), Sequelize],
      path: migrationsPath
    }
  });

  return Promise.resolve(!isProduction && umzug.up())
    .then(() => umzug.executed())
    .then(migrations => {
      const files = migrations.map(it => it.file);
      if (!files.length) return;
      logger.info('⬆️  Executed migrations:', files);
    });
}

const models = {
  District: defineModel(District),
  Program: defineModel(Program),
  ProgramLevel: defineModel(ProgramLevel),
  School: defineModel(School),
  User: defineModel(User)
};

forEach(models, model => {
  invoke(model, 'associate', models);
  invoke(model, 'addHooks', models);
});

const db = {
  Sequelize,
  sequelize,
  initialize,
  ...models
};

// Patch Sequelize#method to support getting models by class name.
sequelize.model = name => sequelize.models[name] || db[name];

module.exports = db;
