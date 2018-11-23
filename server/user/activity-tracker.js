'use strict';

const { User } = require('../common/database');

const updateUserModel = async (user, options) => {
  const fetched = await User.findById(user.id);
  if (fetched) await fetched.update(options);
};

const ONE_HOUR = 3600000;
const TEN_MINUTES = 600000;

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
      untrackTimeout: setTimeout(this.untrack.bind(this, user), ONE_HOUR),
      saveTimeout: setTimeout(this.save.bind(this, user), TEN_MINUTES)
    };
  }

  async updateTrackingObject(user) {
    clearTimeout(this._tracked[user.id].untrackTimeout);
    clearTimeout(this._tracked[user.id].saveTimeout);
    Object.assign(this._tracked[user.id], {
      lastActive: new Date(),
      untrackTimeout: setTimeout(this.untrack.bind(this, user), ONE_HOUR),
      saveTimeout: setTimeout(this.save.bind(this, user), TEN_MINUTES)
    });
  }

  save(user) {
    this.updateLastActiveField(user);
  }

  updateLastActiveField(user) {
    const options = { lastActive: this.lastActive(user) };
    updateUserModel(user, options);
  }

  untrack(user) {
    this.updateLastActiveField(user);
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
