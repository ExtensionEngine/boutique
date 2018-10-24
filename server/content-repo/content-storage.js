'use strict';

const createStorage = require('../common/storage');
const Promise = require('bluebird');
const { storage } = require('../config');
const values = require('lodash/values');

class ContentStorage {
  constructor(options = {}) {
    this.storage = createStorage(options);
    this.options = options;
  }

  getRepository(repoId) {
    const key = `${this._getRepoLocation(repoId)}/index.json`;
    return this.storage.getItem(key);
  }

  getCatalog() {
    const key = `${this.options.sourcePath}/index.json`;
    return this.storage.getItem(key);
  }

  getContainer(repoId, id, programId) {
    const repoLocation = this._getRepoLocation(repoId, programId);
    const key = `${repoLocation}/${id}.container.json`;
    return this.storage.getItem(key);
  }

  getExam(repoId, id, programId) {
    const key = `${this._getRepoLocation(repoId, programId)}/${id}.exam.json`;
    return this.storage.getItem(key);
  }

  getAssessments(repoId, id, programId) {
    const repoLocation = this._getRepoLocation(repoId, programId);
    const key = `${repoLocation}/${id}.assessments.json`;
    return this.storage.getItem(key);
  }

  resolveElements(elements) {
    return Promise.each(elements, element => {
      return this._resolveElement(element);
    }).then(() => elements);
  }

  importRepo(programId, repoId) {
    const src = `${this._getRepoLocation(repoId)}/`;
    const dest = `${this._getRepoLocation(repoId, programId)}/`;
    return this.storage.copyDir(src, dest)
      .then(() => this.getRepository(repoId));
  }

  _getRepoLocation(repoId, programId) {
    return programId
      ? `${this.options.importPath}/${programId}/${repoId}`
      : `${this.options.sourcePath}/${repoId}`;
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

  _resolvePrimitive(primitive) {
    if (primitive.type !== 'IMAGE') return Promise.resolve(primitive);
    return this._resolveAsset(primitive);
  }

  _resolveAsset(asset) {
    const processUrl = key => {
      return this.storage.getFileUrl(key).then(url => {
        asset.data.url = url;
        return asset;
      });
    };
    return this.storage.fileExists(asset.data.url)
      .then(exists => exists ? processUrl(asset.data.url) : asset);
  }
}

module.exports = new ContentStorage(storage);
