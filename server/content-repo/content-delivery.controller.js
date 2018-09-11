'use strict';

const { ContentRepo } = require('../common/database');

function list(req, res) {
  const opts = {
    where: { cohortId: req.cohort.id },
    attributes: { exclude: ['structure'] }
  };
  return ContentRepo.all(opts)
    .then(repos => res.jsend.success(repos));
}

function get(req, res) {
  return res.jsend.success(req.repo);
}

module.exports = {
  list,
  get
};
