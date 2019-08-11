'use strict';

const createStorage = require('../common/storage');
const Promise = require('bluebird');
const { storage: config } = require('../config');
const values = require('lodash/values');
const path = require('path');

const isStorageResource = url => url.protocol === 'storage:';
const FileTypes = {
  index: 'index',
  container: 'container',
  exam: 'exam',
  assessments: 'assessments'
};

/**
 * Get storage path from storage url
 * @param {URL} url
 * @returns {StoragePath}
 */
const storagePath = url => path.join(url.host, url.pathname);

class ContentStorage {
  constructor(options = {}) {
    this.storage = createStorage(options);
    this.options = options;
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

class ImportStorage extends ContentStorage {
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
}

class DeliveryStorage extends ContentStorage {
  getContainer(repoId, id, programId) {
    const key = this._getKey(repoId, FileTypes.container, programId, id);
    return this.storage.getItem(key);
  }

  getExam(repoId, id, programId) {
    const key = this._getKey(repoId, FileTypes.exam, programId, id);
    return this.storage.getItem(key);
  }

  getAssessments(repoId, id, programId) {
    const key = this._getKey(repoId, FileTypes.assessments, programId, id);
    return this.storage.getItem(key);
  }

  resolveElements(elements) {
    return Promise.each(elements, element => {
      return this._resolveElement(element);
    }).then(() => elements);
  }

  _resolveElement(element) {
    return element.data.embeds
      ? this._resolveComposite(element)
      : this._resolvePrimitive(element);
  }

  _resolveComposite(composite) {
    return Promise.each(values(composite.data.embeds), primitive => {
      return this._resolvePrimitive(primitive);
    }).then(() => composite);
  }

  async _resolvePrimitive(primitive) {
    if (primitive.data.url) {
      primitive.data.url = await this._resolveAsset(primitive.data.url);
    }
    if (primitive.data.assets) {
      const resolvedAssets = await this._resolvePrimitiveAssets(primitive.data.assets);
      Object.assign(primitive.data, resolvedAssets);
    }
    return primitive;
  }

  /**
   * Resolve all detected asset url's.
   * @param {Assets<StoragePath>} assets
   * @returns {Promise<Assets<PublicUrl>>}
   */
  _resolvePrimitiveAssets(assets) {
    return Promise.reduce(Object.entries(assets), async (resolved, [asset, assetUrl]) => {
      const publicUrl = await this._processAssetStorageUrl(assetUrl);
      return Object.assign(resolved, { [asset]: publicUrl });
    }, {});
  }

  /**
   * Resolve url if its storage path, otherwise return unmodified.
   * @param {StoragePath} assetUrl
   */
  async _processAssetStorageUrl(assetUrl) {
    const url = new URL(assetUrl);
    if (!isStorageResource(url)) return url;
    return this._resolveAsset(storagePath(url));
  }

  /**
   * Resolve storage path to public url.
   * @param {StoragePath} path
   * @returns {PublicUrl}
   */
  _resolveAsset(path) {
    return this.storage.getFileUrl(path).catch(() => path);
  }
}

module.exports = {
  import: new ImportStorage(config),
  delivery: new DeliveryStorage(config)
};
