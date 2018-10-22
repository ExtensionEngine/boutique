
const { storage } = require('../../config');
const getStream = require('get-stream');
const path = require('path');

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

  getRepoLocation(repoId, programId) {
    return programId
      ? `${storage.importedContentLocation}/${programId}/${repoId}`
      : `${storage.publishedContentLocation}/${repoId}`;
  }

  getFile(key) {
    return getStream(this.store.createReadStream({ key }));
  }

  getFileUrl(key) {
    return this.store.getFileUrl(key);
  }

  getItem(key) {
    return this.getFile(key)
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

  getCatalog() {
    return this.getItem(`${storage.publishedContentLocation}/index.json`);
  }

  getRepository(repoId) {
    const key = `${this.getRepoLocation(repoId)}/index.json`;
    return this.getItem(key);
  }

  getContainer(repoId, id, programId) {
    const key =
      `${this.getRepoLocation(repoId, programId)}/${id}.container.json`;
    return this.getItem(key);
  }

  getExam(repoId, id, programId) {
    const key = `${this.getRepoLocation(repoId, programId)}/${id}.exam.json`;
    return this.getItem(key);
  }

  getAssessments(repoId, id, programId) {
    const key =
      `${this.getRepoLocation(repoId, programId)}/${id}.assessments.json`;
    return this.getItem(key);
  }

  importRepo(programId, repoId) {
    const src = `${this.getRepoLocation(repoId)}/`;
    const dest = `${this.getRepoLocation(repoId, programId)}/`;
    return this.store.copyDir(src, dest)
      .then(() => this.getRepository(repoId));
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
  try {
    return require(path.join(__dirname, './providers/', name));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') throw new Error('Unsupported provider');
    throw err;
  }
}

function isStore(obj = {}) {
  return isFunction(obj.createReadStream) || isFunction(obj.exists);
}
