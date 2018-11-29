'use strict';

const { User } = require('../common/database');
const debounce = require('lodash/debounce');
const throttle = require('lodash/throttle');
const ms = require('ms');

class ActivityTracker {
  constructor({ saveInterval, ttl }) {
    this.tracked = {};
    this.saveInterval = ms(saveInterval);
    this.ttl = ms(ttl);
  }

  track(id) {
    if (!this.tracked[id]) {
      this.tracked[id] = {
        save: throttle(() => this.save(id), this.saveInterval),
        untrack: debounce(() => this.untrack(id), this.ttl)
      };
    }
    this.tracked[id].lastActive = new Date();
    ['untrack', 'save'].forEach(fn => this.tracked[id][fn]());
  }

  async untrack(id) {
    if (!this.tracked[id]) return;
    await this.save(id);
    ['untrack', 'save'].forEach(fn => this.tracked[id][fn].cancel());
    this.tracked[id] = null;
  }

  async save(id) {
    const lastActive = this.lastActive(id);
    await User.update({ lastActive }, { where: { id } });
  }

  lastActive(id) {
    if (!this.tracked[id]) return;
    return this.tracked[id].lastActive;
  }
}

module.exports = new ActivityTracker({
  saveInterval: '1 hour',
  ttl: '10 minutes'
});
