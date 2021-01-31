'use strict';

const Promise = require('bluebird');
const { promisify } = require('util');

const isProduction = process.env.NODE_ENV === 'production';
Promise.config({ longStackTraces: !isProduction });

/* eslint-disable require-sort/require-sort */
const { ip, port } = require('./config');
const app = require('./app');
const database = require('./common/database');
const logger = require('./common/logger')();
/* eslint-enable */

const runServer = promisify(app.listen.bind(app));

const address = `http://${ip}:${port}`;

database.initialize()
  .then(() => runServer(port, ip))
  .then(() => logger.info({ port, ip }, '✈️  Server listening on', address))
  .catch(err => {
    logger.fatal(err, '🚨  Starting server failed');
    process.exit(1);
  });
