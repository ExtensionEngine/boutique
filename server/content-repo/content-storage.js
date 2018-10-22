'use strict';

const autobind = require('auto-bind');
const config = require('../config');
const Promise = require('bluebird');
const Storage = require('../common/storage');
const values = require('lodash/values');

class ContentStorage extends Storage {
  constructor(storage) {
    super(storage);
    autobind(this);
  }

  resolveAsset(asset) {
    const getUrl = key => {
      return this.getFileUrl(key)
        .then(url => (asset.data.url = url))
        .then(() => asset);
    };
    return this.fileExists(asset.data.url)
      .then(exists => exists ? getUrl(asset.data.url) : asset);
  }

  resolvePrimitive(primitive) {
    if (primitive.type !== 'IMAGE') return Promise.resolve(primitive);
    return this.resolveAsset(primitive);
  }

  resolveComposite(composite) {
    return Promise.each(values(composite.data.embeds), this.resolvePrimitive)
      .then(() => composite);
  }

  resolveElement(element) {
    return element.data.embeds
      ? this.resolveComposite(element)
      : this.resolvePrimitive(element);
  }

  resolveContainer(container) {
    return Promise.each(container.elements, this.resolveElement)
      .then(() => container);
  }
}

module.exports = new ContentStorage(config.storage);
