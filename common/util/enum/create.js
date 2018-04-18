const mapKeys = require('lodash/mapKeys');

module.exports = (...values) => ({
  get values() { return values; },
  ...mapKeys(values),
  fromPosition(position) {
    const pos = parseInt(position, 10);
    return values[pos - 1];
  }
});
