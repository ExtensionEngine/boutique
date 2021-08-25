'use strict';

const ms = require('ms');

module.exports = {
  hostname: process.env.HOSTNAME,
  port: process.env.PORT,
  ip: process.env.IP,
  apiPath: process.env.API_PATH || '/api/v1/',
  uploadLimit: '10mb',
  importTemplateFormat: process.env.IMPORT_TEMPLATE_FORMAT || 'xlsx',
  cors: {
    allowedOrigins: [],
    allowedHeaders: []
  },
  auth: {
    saltRounds: parseInt(process.env.AUTH_SALT_ROUNDS, 10),
    scheme: process.env.AUTH_JWT_SCHEME || 'JWT',
    secret: process.env.AUTH_JWT_SECRET,
    issuer: process.env.AUTH_JWT_ISSUER,
    audience: process.env.AUTH_JWT_AUDIENCE
  },
  email: {
    sender: {
      name: process.env.EMAIL_SENDER_NAME,
      address: process.env.EMAIL_SENDER_ADDRESS
    },
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || null,
    ssl: Boolean(process.env.EMAIL_SSL),
    tls: Boolean(process.env.EMAIL_TLS)
  },
  storage: {
    amazon: {
      key: process.env.STORAGE_KEY,
      secret: process.env.STORAGE_SECRET,
      region: process.env.STORAGE_REGION,
      bucket: process.env.STORAGE_BUCKET
    },
    filesystem: {
      path: process.env.STORAGE_PATH
    },
    provider: process.env.STORAGE_PROVIDER,
    sourcePath: process.env.PUBLISHED_CONTENT,
    importPath: process.env.IMPORTED_CONTENT
  },
  userActivity: {
    yieldInterval: ms(process.env.USER_ACTIVITY_YIELD_INTERVAL || '1h'),
    ttl: ms(process.env.USER_ACTIVITY_TTL || '10min')
  }
};
