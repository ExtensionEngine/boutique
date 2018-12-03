'use strict';

const throttle = require('lodash/throttle');
const logger = require('../common/logger')('activity-tracker');

let ttl, saveInterval;
const trackedUsers = {};

class ActivityTracker {
  constructor(user) {
    this._user = user;
    this._throttledSave = throttle(() => this.save(), saveInterval);
  }

  get user() {
    return this._user;
  }

  get lastActive() {
    return this._lastActive;
  }

  track() {
    if (!this.lastActive) logger.info(this.user.profile, '👤 Session started');
    if (this._timer) clearTimeout(this._timer);
    this._timer = setTimeout(() => this.destroy(), ttl);
    this._lastActive = new Date();
    this._throttledSave();
  }

  destroy() {
    if (this._timer) clearTimeout(this._timer);
    this._throttledSave.flush();
    trackedUsers[this.user.id] = null;
    logger.info(this.user.profile, '👤 Session ended');
  }

  async save() {
    const { lastActive } = this;
    await this.user.update({ lastActive });
  }

  static lastActive(user) {
    if (trackedUsers[user.id]) return trackedUsers[user.id].lastActive;
    return user.lastActive;
  }

  static startSession(user) {
    trackedUsers[user.id] = trackedUsers[user.id] || new this(user);
    return trackedUsers[user.id].track();
  }

  static endSession(user) {
    return trackedUsers[user.id] && trackedUsers[user.id].destroy();
  }
}

module.exports = (config = {}) => {
  ({ ttl, saveInterval } = config);
  return ActivityTracker;
};
