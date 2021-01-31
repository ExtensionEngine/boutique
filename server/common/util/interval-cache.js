'use strict';

const debounce = require('lodash/debounce');
const each = require('lodash/each');
const { EventEmitter } = require('events');
const ms = require('ms');
const throttle = require('lodash/throttle');

const EVENTS = {
  YIELDED: 'yielded',
  CLEARED: 'cleared'
};

class CacheItem extends EventEmitter {
  constructor(key, value, listeners, { ttl, yieldInterval }) {
    super();
    this.yield = throttle(() => this._yield(key), yieldInterval);
    this.clear = debounce(() => this._clear(key), ttl);
    each(listeners, (handler, event) => this.on(event, handler));
    this.set(value);
  }

  _yield(key) {
    this.emit(EVENTS.YIELDED, key, this.value);
  }

  _clear(key) {
    this.emit(EVENTS.CLEARED, key, this.value);
    this.remove();
  }

  _removeListeners() {
    Object.values(EVENTS).forEach(event => this.removeAllListeners(event));
  }

  get value() {
    return this._value;
  }

  set(value) {
    this._value = value;
    this.clear();
    this.yield();
  }

  remove() {
    this.clear.cancel();
    this.yield.cancel();
    this._removeListeners();
  }
}

class IntervalCache extends EventEmitter {
  constructor(options) {
    super();
    this._map = {};
    this._options = options;
  }

  _yield(key, value) {
    this.emit(EVENTS.YIELDED, key, value);
  }

  _clear(key, value) {
    if (!this._map[key]) return;
    this._map[key] = null;
    this.emit(EVENTS.CLEARED, key, value);
  }

  get _listeners() {
    return {
      [EVENTS.YIELDED]: this._yield.bind(this),
      [EVENTS.CLEARED]: this._clear.bind(this)
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

  remove(key) {
    if (!this._map[key]) return;
    this._map[key].remove();
    this._map[key] = null;
  }
}

module.exports = Object.assign(IntervalCache, { EVENTS });
