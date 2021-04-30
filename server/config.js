'use strict';

const ms = require('ms');
const path = require('path');
const isLocalhost = require('is-localhost');

const hostname = process.env.HOSTNAME || 'localhost';
const protocol = resolveProtocol(hostname);
const port = resolvePort();
const origin = resolveOrigin(hostname, protocol, port);

module.exports = {
  protocol,
  hostname,
  port,
  origin,
  ip: process.env.IP,
  useHistoryApiFallback: process.env.HISTORY_API_FALLBACK,
  apiPath: process.env.API_PATH || '/api/v1/',
  staticFolder: path.resolve(__dirname, '../dist'),
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

function resolveProtocol(hostname) {
  const { PROTOCOL } = process.env;
  if (PROTOCOL) return PROTOCOL;
  return isLocalhost(hostname) ? 'http' : 'https';
}

function resolvePort() {
  const { PORT, SERVER_PORT } = process.env;
  return PORT || SERVER_PORT || 3000;
}

function resolveOrigin(hostname, protocol) {
  const originPort = resolveOriginPort();
  const host = [hostname, originPort].filter(Boolean).join(':');
  return `${protocol}://${host}`;
}

function resolveOriginPort() {
  const { REVERSE_PROXY_PORT } = process.env;
  if (!REVERSE_PROXY_PORT) return port;
  if (REVERSE_PROXY_PORT === '80' || REVERSE_PROXY_PORT === '443') return '';
  return REVERSE_PROXY_PORT;
}