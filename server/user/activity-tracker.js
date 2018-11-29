'use strict';

const { User } = require('../common/database');
const debounce = require('lodash/debounce');
const throttle = require('lodash/throttle');

const toMiliseconds = min => min * 60000;

class ActivityTracker {
  constructor({ saveInterval, ttl }) {
    this.tracked = {};
    this.saveInterval = toMiliseconds(saveInterval);
    this.ttl = toMiliseconds(ttl);
  }

  track(id) {
    if (!this.tracked[id]) {
      this.tracked[id] = {
        save: throttle(() => this.save(id), this.saveInterval),
        untrack: debounce(() => this.untrack(id), this.ttl)
      };
    }
    this.tracked[id].lastActive = new Date();
    this.tracked[id].untrack();
    this.tracked[id].save();
  }

  untrack(id) {
    if (!this.tracked[id]) return;
    this.save(id).then(() => {
      this.tracked[id].untrack.cancel();
      this.tracked[id].save.cancel();
      this.tracked[id] = null;
    });
  }

  save(id) {
    const lastActive = this.lastActive(id);
    return User.update({ lastActive }, { where: { id } });
  }

  lastActive(id) {
    if (!this.tracked[id]) return;
    return this.tracked[id].lastActive;
  }
}

module.exports = new ActivityTracker({ saveInterval: 60, ttl: 10 });
