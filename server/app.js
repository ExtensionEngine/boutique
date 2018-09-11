'use strict';

const AuthError = require('passport/lib/errors/authenticationerror');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const HttpError = require('http-errors').HttpError;
const jsend = require('jsend').middleware;
const morgan = require('morgan');
const nocache = require('nocache');
require('express-async-errors');

const auth = require('./common/auth');
const config = require('./config');
const logger = require('./common/logger')();
const origin = require('./common/origin');
const router = require('./router');

const app = express();
app.use(helmet());
app.use(cors({ origin: config.cors.allowedOrigins, credentials: true }));
app.use(bodyParser.json({ limit: config.uploadLimit }));
app.use(auth.initialize());
app.use(origin());
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
app.use('/api/v1', nocache(), router);

// Global error handler.
app.use((err, req, res, next) => {
  if ((err instanceof HttpError) || (err instanceof AuthError)) {
    res.status(err.status).jsend.error(err.message);
    return;
  }
  res.status(500).end();
  logger.error({ err });
});

// Handle non-existing routes.
app.use((req, res, next) => res.status(404).end());

module.exports = app;
