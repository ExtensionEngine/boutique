'use strict';

class ActivityTracker {
  constructor() {
    this._tracked = {};
  }

  track(user) {
    if (!user) return;
    if (this.isTracked(user)) return;
    this._tracked[user.id] = { lastActive: new Date() };
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

module.exports = new ActivityTracker();
