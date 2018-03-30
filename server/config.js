'use strict';

const path = require('path');

module.exports = {
  port: process.env.PORT,
  ip: process.env.IP,
  staticFolder: path.resolve(__dirname, '../dist'),
  uploadLimit: '10mb',
  cors: {
    allowedOrigins: [],
    allowedHeaders: []
  },
  auth: {
    saltRounds: parseInt(process.env.AUTH_SALT_ROUNDS, 10),
    scheme: process.env.AUTH_JWT_SCHEME,
    secret: process.env.AUTH_JWT_SECRET
    // issuer: process.env.AUTH_JWT_ISSUER,
    // audience: process.env.AUTH_JWT_AUDIENCE
  }
};
