'use strict';

const { School } = require('../common/database');

function list(req, res) {
  return School.findAll().then(schools => res.jsend.success(schools));
}

module.exports = {
  list
};
