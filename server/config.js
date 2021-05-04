'use strict';

const ms = require('ms');
const path = require('path');
const isLocalhost = require('is-localhost');

const { env } = process;

const hostname = env.HOSTNAME || 'localhost';
const protocol = resolveProtocol(hostname);
const port = resolvePort();
const origin = resolveOrigin(hostname, protocol, port);

module.exports = {
  protocol,
  hostname,
  port,
  origin,
  ip: env.IP,
  useHistoryApiFallback: env.HISTORY_API_FALLBACK,
  apiPath: env.API_PATH || '/api/v1/',
  staticFolder: path.resolve(__dirname, '../dist'),
  uploadLimit: '10mb',
  importTemplateFormat: env.IMPORT_TEMPLATE_FORMAT || 'xlsx',
  cors: {
    allowedOrigins: [],
    allowedHeaders: []
  },
  auth: {
    saltRounds: parseInt(env.AUTH_SALT_ROUNDS, 10),
    secret: env.AUTH_JWT_SECRET,
    issuer: env.AUTH_JWT_ISSUER,
    cookie: {
      name: env.AUTH_JWT_COOKIE_NAME || 'access_token',
      secret: env.AUTH_JWT_COOKIE_SECRET,
      signed: !!env.AUTH_JWT_COOKIE_SECRET,
      secure: protocol === 'https' && !isLocalhost(hostname),
      httpOnly: true
    },
  },
  email: {
    sender: {
      name: env.EMAIL_SENDER_NAME,
      address: env.EMAIL_SENDER_ADDRESS
    },
    user: env.EMAIL_USER,
    password: env.EMAIL_PASSWORD,
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT || null,
    ssl: Boolean(env.EMAIL_SSL),
    tls: Boolean(env.EMAIL_TLS)
  },
  storage: {
    amazon: {
      key: env.STORAGE_KEY,
      secret: env.STORAGE_SECRET,
      region: env.STORAGE_REGION,
      bucket: env.STORAGE_BUCKET
    },
    filesystem: {
      path: env.STORAGE_PATH
    },
    provider: env.STORAGE_PROVIDER,
    sourcePath: env.PUBLISHED_CONTENT,
    importPath: env.IMPORTED_CONTENT
  },
  userActivity: {
    yieldInterval: ms(env.USER_ACTIVITY_YIELD_INTERVAL || '1h'),
    ttl: ms(env.USER_ACTIVITY_TTL || '10min')
  }
};

function resolveProtocol(hostname) {
  const { PROTOCOL } = env;
  if (PROTOCOL) return PROTOCOL;
  return isLocalhost(hostname) ? 'http' : 'https';
}

function resolvePort() {
  const { PORT, SERVER_PORT } = env;
  return PORT || SERVER_PORT || 3000;
}

function resolveOrigin(hostname, protocol) {
  const originPort = resolveOriginPort();
  const host = [hostname, originPort].filter(Boolean).join(':');
  return `${protocol}://${host}`;
}

function resolveOriginPort() {
  const { REVERSE_PROXY_PORT } = env;
  if (!REVERSE_PROXY_PORT) return port;
  if (REVERSE_PROXY_PORT === '80' || REVERSE_PROXY_PORT === '443') return '';
  return REVERSE_PROXY_PORT;
}