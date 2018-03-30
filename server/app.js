'use strict';

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const HttpError = require('http-errors').HttpError;
const jsend = require('jsend').middleware;
const morgan = require('morgan');
const passport = require('passport');

// Setup authentication before instantiating the main app router.
// eslint-disable-next-line no-unused-vars
const auth = require('./auth');
const config = require('./config');
const logger = require('./logger')();
const router = require('./router');

const app = express();
app.use(helmet());
app.use(cors({ origin: config.cors.allowedOrigins, credentials: true }));
app.use(bodyParser.json({ limit: config.uploadLimit }));
app.use(passport.initialize());
app.use(express.static(config.staticFolder));
app.use(jsend);

// Log http requests
const isSuccessful = res => res.statusCode <= 400;
const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(format, {
  skip: (req, res) => isSuccessful(res),
  stream: process.stderr
}));
app.use(morgan(format, {
  skip: (req, res) => !isSuccessful(res),
  stream: process.stdout
}));

// Mount main router
app.use('/api/v1', router);

// Global error handler.
app.use((err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.status).jsend.error(err.message);
    return;
  }
  res.status(500).end();
  logger.error({ err });
});

// Handle non-existing routes.
app.use((req, res, next) => res.status(404).end());

module.exports = app;
