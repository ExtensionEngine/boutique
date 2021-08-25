'use strict';

require('express-async-errors');
const auth = require('./common/auth');
const AuthError = require('passport/lib/errors/authenticationerror');
const bodyParser = require('body-parser');
const config = require('./config');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const HttpError = require('http-errors').HttpError;
const { INTERNAL_SERVER_ERROR } = require('http-status');
const jsend = require('jsend').middleware;
const morgan = require('morgan');
const nocache = require('nocache');
const origin = require('./common/origin');
const router = require('./router');
const logger = require('./common/logger')();

const app = express();
app.use(helmet());
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true,
  preflightContinue: true
}));
app.use(bodyParser.json({ limit: config.uploadLimit }));
app.use(auth.initialize());
app.use(origin());
app.use(jsend);

// Log http requests
const isSuccessful = res => res.statusCode >= 200 && res.statusCode < 300;
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
app.use(config.apiPath, nocache(), router);

// Global error handler.
app.use((err, req, res, next) => {
  if ((err instanceof HttpError) || (err instanceof AuthError)) {
    res.status(err.status).jsend.error(err.message);
    return;
  }
  res.status(INTERNAL_SERVER_ERROR).end();
  logger.error({ req, err }, '🚨  Internal Error:', err.message);
});

module.exports = app;
