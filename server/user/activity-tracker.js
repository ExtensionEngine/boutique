'use strict';

class ActivityTracker {
  constructor() {
    this._tracked = {};
  }

  track(user) {
    if (!user || this.isTracked(user)) return;
    this._tracked[user.id] = { lastActive: new Date() };
  }

  isTracked(user) {
    return this._tracked.hasOwnProperty(user.id);
  }
}

module.exports = new ActivityTracker();
