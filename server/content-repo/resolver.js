'use strict';

const path = require('path');
const Promise = require('bluebird');
const values = require('lodash/values');

/** @typedef {string} StoragePath */
/** @typedef {string} PublicUrl */
/**
 * @template T
 * @typedef {{string: T}} Assets
 */

const isStorageResource = url => url.protocol === 'storage:';

/**
 * Get storage path from storage url
 * @param {URL} url
 * @returns {StoragePath}
 */
const storagePath = url => path.join(url.host, url.pathname);

class ContentResolver {
  constructor(storage) {
    this.storage = storage;
  }

  resolve(elements) {
    return Promise.map(elements, elem => {
      return elem.data.embeds ? this._composite(elem) : this._primitive(elem);
    });
  }

  _composite(elem) {
    return Promise.map(values(elem.data.embeds), it => this._primitive(it));
  }

  async _primitive(elem) {
    if (elem.data.url) {
      elem.data.url = await this._publicUrl(elem.data.url);
    }
    if (elem.data.assets) {
      const resolvedAssets = await this._resolveAssets(elem.data.assets);
      Object.assign(elem.data, resolvedAssets);
    }
    return elem;
  }

  /**
   * Resolve all detected asset url's.
   * @param {Assets<StoragePath>} assets
   * @returns {Promise<Assets<PublicUrl>>}
   */
  _resolveAssets(assets) {
    return Promise.reduce(Object.entries(assets), async (resolved, [asset, assetUrl]) => {
      const url = await this._resolveStorageUrl(assetUrl);
      return Object.assign(resolved, { [asset]: url });
    }, {});
  }

  /**
   * Resolve url if its storage path, otherwise return unmodified.
   * @param {StoragePath} assetUrl
   */
  async _resolveStorageUrl(assetUrl) {
    const url = new URL(assetUrl);
    if (!isStorageResource(url)) return url;
    return this._publicUrl(storagePath(url));
  }

  /**
   * Resolve storage path to public url.
   * @param {StoragePath} path
   * @returns {PublicUrl}
   */
  _publicUrl(path) {
    return this.storage.getFileUrl(path).catch(() => path);
  }
}

module.exports = ContentResolver;
