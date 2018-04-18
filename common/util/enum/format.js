const humanize = require('humanize-string');
const map = require('lodash/map');

module.exports = e => map(e.values, it => ({ label: humanize(it), value: it }));
