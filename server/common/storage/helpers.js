'use strict';

const config = require('../../config');
const createStorage = require('../storage');
const Promise = require('bluebird');
const values = require('lodash/values');

const Storage = createStorage(config.storage);

function resolveAsset(asset) {
  function getUrl(key) {
    return Storage.getFileUrl(key)
      .then(url => (asset.data.url = url))
      .then(() => asset);
  }
  return Storage.fileExists(asset.data.url)
    .then(exists => exists ? getUrl(asset.data.url) : asset);
}

function resolvePrimitive(primitive) {
  if (primitive.type !== 'IMAGE') return Promise.resolve(primitive);
  return resolveAsset(primitive);
}

function resolveComposite(composite) {
  return Promise.each(values(composite.data.embeds), resolvePrimitive)
    .then(() => composite);
}

function resolveElement(element) {
  return element.data.embeds
    ? resolveComposite(element)
    : resolvePrimitive(element);
}

function resolveContainer(container) {
  return Promise.each(container.elements, resolveElement)
    .then(() => container);
}

module.exports = {
  resolveContainer
};
