'use strict';

const { ip, port } = require('./config');
const app = require('./app');
const bluebird = require('bluebird');
const database = require('./common/database');
const { promisify } = require('util');
const sequelize = require('sequelize');
const logger = require('./common/logger')();
const runServer = promisify(app.listen.bind(app));

if (process.env.NODE_ENV !== 'production') {
  sequelize.Promise.config({ longStackTraces: true });
  bluebird.config({ longStackTraces: true });
}

const address = `http://${ip}:${port}`;

database.initialize()
  .then(() => runServer(port, ip))
  .then(() => logger.info({ port, ip }, '✈️  Server listening on', address))
  .catch(err => {
    logger.fatal(err, '🚨  Starting server failed');
    process.exit(1);
  });
