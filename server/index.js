'use strict';

const { promisify } = require('util');
const bluebird = require('bluebird');
const sequelize = require('sequelize');

if (process.env.NODE_ENV !== 'production') {
  sequelize.Promise.config({ longStackTraces: true });
  bluebird.config({ longStackTraces: true });
}

const { ip, port } = require('./config');
const app = require('./app');
const database = require('./common/database');
const logger = require('./common/logger')();
const runServer = promisify(app.listen.bind(app));

const address = `http://${ip}:${port}`;

database.initialize()
  .then(() => runServer(port, ip))
  .then(() => logger.info({ port, ip }, '✈️  Server listening on', address))
  .catch(err => {
    logger.fatal(err, '🚨  Starting server failed');
    process.exit(1);
  });
