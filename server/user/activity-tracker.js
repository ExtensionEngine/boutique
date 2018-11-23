'use strict';

const { User } = require('../common/database');

class ActivityTracker {
  constructor({ saveInterval, ttl }) {
    this._tracked = {};
    this.ttl = ttl;
    this.saveInterval = saveInterval;
  }

  track(user) {
    if (!user) return;
    if (this.isTracked(user)) {
      this.updateTrackingObject(user);
    } else {
      this.createTrackingObject(user);
    }
  }

  untrack(user) {
    this.save(user);
    clearInterval(this._tracked[user.id].saveInterval);
    delete this._tracked[user.id];
  }

  createTrackingObject(user) {
    this._tracked[user.id] = {
      lastActive: new Date(),
      untrackTimeout: setTimeout(this.untrack.bind(this, user), this.saveInterval),
      saveInterval: setInterval(this.save.bind(this, user), this.ttl)
    };
  }

  updateTrackingObject(user) {
    clearTimeout(this._tracked[user.id].untrackTimeout);
    Object.assign(this._tracked[user.id], {
      lastActive: new Date(),
      untrackTimeout: setTimeout(this.untrack.bind(this, user), this.saveInterval)
    });
  }

  save(user) {
    const lastActive = this.lastActive(user);
    return User.update({ lastActive }, { where: { id: user.id } });
  }

  lastActive(user) {
    if (this.isTracked(user)) {
      return this._tracked[user.id].lastActive;
    }
  }

  isTracked(user) {
    return user && this._tracked.hasOwnProperty(user.id);
  }
}

module.exports = new ActivityTracker({ saveInterval: 3600000, ttl: 600000 });
