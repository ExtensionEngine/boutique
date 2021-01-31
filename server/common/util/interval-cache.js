'use strict';

const debounce = require('lodash/debounce');
const each = require('lodash/each');
const { EventEmitter } = require('events');
const throttle = require('lodash/throttle');

const Events = {
  YIELDED: 'yielded',
  CLEARED: 'cleared'
};

class CacheItem extends EventEmitter {
  constructor(key, value, listeners, { ttl, yieldInterval }) {
    super();
    this._key = key;
    this.yield = throttle(this._yield.bind(this), yieldInterval);
    this.clear = debounce(this._clear.bind(this), ttl);
    each(listeners, (handler, event) => this.on(event, handler));
    this.set(value);
  }

  _yield() {
    this.emit(Events.YIELDED, this._key, this.value);
  }

  _clear({ silent = false } = {}) {
    if (!silent) this.emit(Events.CLEARED, this._key, this.value);
    this.clear.cancel();
    this.yield.cancel();
    this._removeListeners();
  }

  _removeListeners() {
    Object.values(Events).forEach(event => this.removeAllListeners(event));
  }

  get value() {
    return this._value;
  }

  set(value) {
    this._value = value;
    this.clear();
    this.yield();
  }
}

class IntervalCache extends EventEmitter {
  constructor(options) {
    super();
    this._map = {};
    this._options = options;
  }

  _yield(key, value) {
    this.emit(Events.YIELDED, key, value);
  }

  _clear(key, value) {
    if (!this._map[key]) return;
    this._map[key] = null;
    this.emit(Events.CLEARED, key, value);
  }

  get _listeners() {
    return {
      [Events.YIELDED]: this._yield.bind(this),
      [Events.CLEARED]: this._clear.bind(this)
    };
  }

  get(key) {
    const { value } = this._map[key] || {};
    return value;
  }

  set(key, value) {
    if (this._map[key]) return this._map[key].set(value);
    this._map[key] = new CacheItem(key, value, this._listeners, this._options);
  }

  clear(key, { silent = false } = {}) {
    if (!this._map[key]) return;
    this._map[key].clear.flush({ silent });
    this._map[key] = null;
  }
}

module.exports = Object.assign(IntervalCache, { Events });
