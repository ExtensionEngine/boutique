'use strict';

const createStorage = require('../common/storage');
const { storage: config } = require('../config');
const path = require('path');
const ContentResolver = require('./resolver');

const storage = createStorage(config);

/** @typedef {'index'|'container'|'exam'|'assessments'} StorageFile */
const FileTypes = {
  index: 'index',
  container: 'container',
  exam: 'exam',
  assessments: 'assessments'
};

class ContentImport {
  constructor(storage, options = {}) {
    this.storage = storage;
    this.options = options;
  }

  getCatalog() {
    const key = path.join(this.options.sourcePath, 'index.json');
    return this.storage.getItem(key);
  }

  importRepo(programId, repoId) {
    const src = `${this._getRepoLocation(repoId)}/`;
    const dest = `${this._getRepoLocation(repoId, programId)}/`;
    return this.storage.copyDir(src, dest)
      .then(() => this.getRepository(repoId));
  }

  getRepository(repoId) {
    const key = this._getKey(repoId, FileTypes.index);
    return this.storage.getItem(key);
  }

  _getRepoLocation(repoId, programId) {
    return programId
      ? path.join(this.options.importPath, String(programId), String(repoId))
      : path.join(this.options.sourcePath, String(repoId));
  }

  /**
   * Generate path for file in storage.
   * @param {number} repoId
   * @param {StorageFile} fileType
   * @param {number} [programId]
   * @param {number} [elemId]
   */
  _getKey(repoId, fileType, programId = null, elemId = null) {
    const repoLocation = this._getRepoLocation(repoId, programId);
    const fileName = [elemId, fileType, 'json'].filter(Boolean).map(String).join('.');
    return path.join(repoLocation, fileName);
  }
}

class ContentDelivery extends ContentImport {
  constructor(...args) {
    super(...args);
    this.resolver = new ContentResolver(this.storage);
  }

  async getContainer(repoId, id, programId) {
    const key = this._getKey(repoId, FileTypes.container, programId, id);
    const container = await this.storage.getItem(key);
    const elements = await this.resolver.resolve(container.elements);
    return Object.assign(container, { elements });
  }

  getExam(repoId, id, programId) {
    const key = this._getKey(repoId, FileTypes.exam, programId, id);
    return this.storage.getItem(key);
  }

  getAssessments(repoId, id, programId) {
    const key = this._getKey(repoId, FileTypes.assessments, programId, id);
    return this.storage.getItem(key);
  }
}

module.exports = {
  import: new ContentImport(storage, config),
  delivery: new ContentDelivery(storage, config)
};
