'use strict';

const { School } = require('../common/database');
const districtImport = require('../district/import');

function list({ query: { districtId } }, res) {
  const where = districtId ? { districtId } : {};
  return School.findAll({ where, include: [ 'district' ] })
    .then(schools => res.jsend.success(schools));
}

function handleImport({ file }, res, next) {
  if (!file) return res.sendStatus(400);
  // TODO: validate file
  return districtImport(file.path)
    .then(data => res.jsend.success(data))
    .catch(err => next(err));
}

module.exports = {
  list,
  handleImport
};
