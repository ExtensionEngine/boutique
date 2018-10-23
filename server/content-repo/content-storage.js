'use strict';

const { storage } = require('../config');
const Promise = require('bluebird');
const createStorage = require('../common/storage');
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
    const key = `${this.options.publishedContentLocation}/index.json`;
    return this.storage.getItem(key);
  }

  getContainer(repoId, id, programId) {
    const key =
      `${this._getRepoLocation(repoId, programId)}/${id}.container.json`;
    return this.storage.getItem(key);
  }

  getExam(repoId, id, programId) {
    const key = `${this._getRepoLocation(repoId, programId)}/${id}.exam.json`;
    return this.storage.getItem(key);
  }

  getAssessments(repoId, id, programId) {
    const key =
      `${this._getRepoLocation(repoId, programId)}/${id}.assessments.json`;
    return this.storage.getItem(key);
  }

  resolveContainer(container) {
    return Promise.each(container.elements, element => {
      return this._resolveElement(element);
    }).then(() => container);
  }

  importRepo(programId, repoId) {
    const src = `${this._getRepoLocation(repoId)}/`;
    const dest = `${this._getRepoLocation(repoId, programId)}/`;
    return this.storage.copyDir(src, dest)
      .then(() => this.getRepository(repoId));
  }

  _getRepoLocation(repoId, programId) {
    return programId
      ? `${this.options.importedContentLocation}/${programId}/${repoId}`
      : `${this.options.publishedContentLocation}/${repoId}`;
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
    const _getUrl = key => {
      return this.storage.getFileUrl(key)
        .then(url => (asset.data.url = url))
        .then(() => asset);
    };
    return this.storage.fileExists(asset.data.url)
      .then(exists => exists ? _getUrl(asset.data.url) : asset);
  }
}

module.exports = new ContentStorage(storage);
