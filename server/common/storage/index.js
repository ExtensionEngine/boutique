'use strict';

const getStream = require('get-stream');
const path = require('path');
const safeRequire = require('safe-require');

const isFunction = arg => typeof arg === 'function';

class NotFoundError extends Error {
  constructor(key, { cause } = {}) {
    super(`Item not found [key=${key}]`);
    this.key = key;
    if (cause) this.cause = cause;
  }
}

class Storage {
  constructor(store, { errors = {} } = {}) {
    if (!isStore(store)) throw new TypeError('Invalid store provided');
    this.store = store;
    this.errors = errors;
  }

  getItem(key) {
    return this._getFile(key)
      .catch(err => {
        const { notFound } = this.errors;
        // Wrap not found errors using NotFoundError class.
        if (!notFound || !notFound(err)) return Promise.reject(err);
        return Promise.reject(new NotFoundError(key, { cause: err }));
      })
      .then(str => JSON.parse(str));
  }

  fileExists(key) {
    return new Promise((resolve, reject) => {
      this.store.exists({ key }, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  getFileUrl(key) {
    return this.store.getFileUrl(key);
  }

  copyDir(src, dest) {
    return this.store.copyDir(src, dest);
  }

  _getFile(key) {
    return getStream(this.store.createReadStream({ key }));
  }
}

function createStorage(options = {}) {
  // Validate provider name.
  const providerName = options.provider;
  if (!options[providerName]) {
    throw new Error('Provider should be defined in config');
  }

  // Validate provider config.
  const config = options[providerName];
  const provider = loadProvider(providerName);
  provider.schema.validate(config, { stripUnknown: true }, err => {
    if (err) throw new Error('Unsupported config structure');
  });

  // Create store & client instance.
  const store = provider.createStore(config);
  const { errors } = provider;
  return new Storage(store, { errors });
}

module.exports = createStorage;
module.exports.NotFoundError = NotFoundError;

function loadProvider(name) {
  const provider = safeRequire(path.join(__dirname, './providers/', name));
  if (!provider) throw new Error('Unsupported provider');
  return provider;
}

function isStore(obj = {}) {
  return isFunction(obj.createReadStream) || isFunction(obj.exists);
}
