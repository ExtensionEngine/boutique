'use strict';

const { User } = require('../common/database');

const updateUserModel = async (user, options) => {
  const fetched = await User.findById(user.id);
  if (fetched) await fetched.update(options);
};

const ONE_HOUR = 3600000;

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
      lastActive: new Date(),
      untrackTimeout: setTimeout(this.untrack.bind(this, user), ONE_HOUR)
    };
  }

  async updateTrackingObject(user) {
    clearTimeout(this._tracked[user.id].untrackTimeout);
    Object.assign(this._tracked[user.id], {
      lastActive: new Date(),
      untrackTimeout: setTimeout(this.untrack.bind(this, user), ONE_HOUR)
    });
  }

  untrack(user) {
    const options = { lastActive: this.lastActive(user) };
    updateUserModel(user, options);
    delete this._tracked[user.id];
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
