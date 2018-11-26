'use strict';

const { User } = require('../common/database');
const debounce = require('lodash/debounce');
const throttle = require('lodash/throttle');

class ActivityTracker {
  constructor({ saveInterval, ttl }) {
    this._tracked = {};
    this.saveInterval = saveInterval;
    this.ttl = ttl;
  }

  track(id) {
    if (!this._tracked[id]) {
      this._tracked[id] = {
        save: throttle(() => this.save(id), this.saveInterval),
        untrack: debounce(() => this.untrack(id), this.ttl)
      };
    }
    this._tracked[id].lastActive = new Date();
    this._tracked[id].untrack();
    this._tracked[id].save();
  }

  untrack(id) {
    this.save(id).then(() => {
      this._tracked[id].save.cancel();
      delete this._tracked[id];
    });
  }

  save(id) {
    const lastActive = this.lastActive(id);
    return User.update({ lastActive }, { where: { id } });
  }

  lastActive(id) {
    if (!this._tracked[id]) return;
    return this._tracked[id].lastActive;
  }
}

module.exports = new ActivityTracker({ saveInterval: 3600000, ttl: 600000 });
