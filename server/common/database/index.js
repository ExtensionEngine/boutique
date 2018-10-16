'use strict';

const { migrationsPath } = require('../../../sequelize.config');
const config = require('./config');
const forEach = require('lodash/forEach');
const invoke = require('lodash/invoke');
const logger = require('../logger')();
const pkg = require('../../../package.json');
const semver = require('semver');
const Sequelize = require('sequelize');
const Umzug = require('umzug');

// Require models.
const User = require('../../user/user.model');
const Program = require('../../program/program.model');
const Enrollment = require('../../enrollment/enrollment.model');
const ContentRepo = require('../../content-repo/content-repo.model');

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

  return checkPostgreVersion(sequelize)
    .then(!isProduction && umzug.up())
    .then(() => umzug.executed())
    .then(migrations => {
      const files = migrations.map(it => it.file);
      if (!files.length) return;
      logger.info('⬆️  Executed migrations:', files);
    });
}

const models = {
  User: defineModel(User),
  Program: defineModel(Program),
  Enrollment: defineModel(Enrollment),
  ContentRepo: defineModel(ContentRepo)
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

function checkPostgreVersion(sequelize) {
  const type = sequelize.QueryTypes.VERSION;
  return sequelize.query('SHOW server_version', { type })
    .then(version => {
      logger.info('PostgreSQL version:', version);
      const range = pkg.engines && pkg.engines.postgres;
      if (!range) return;
      if (semver.satisfies(semver.coerce(version), range)) return;
      logger.error(`🚨  ${pkg.name} requires PostgreSQL ${range}\n`, { version });
      logger.error('✋  Exiting due to engine requirement check failure...\n');
      process.exit(1);
    });
}
