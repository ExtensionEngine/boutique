'use strict';

const { District } = require('../common/database');

function list(req, res) {
  return District.findAll().then(items => res.jsend.success(items));
}

module.exports = {
  list
};
