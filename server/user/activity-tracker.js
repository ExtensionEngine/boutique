'use strict';

const { User } = require('../common/database');

class ActivityTracker {
  constructor() {
    this._tracked = {};
  }

  track(user) {
    if (!user) return;
    if (this.isTracked(user)) {
      this.updateTrackingObject(user);
    } else {
      this.createTrackingObject(user);
    }
  }

  createTrackingObject(user) {
    this._tracked[user.id] = {
      lastActive: new Date()
    };
  }

  async updateTrackingObject(user) {
    Object.assign(this._tracked[user.id], {
      lastActive: new Date()
    });
    const fetched = await User.findById(user.id);
    if (fetched) fetched.update({ lastActive: this.lastActive(user) });
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
