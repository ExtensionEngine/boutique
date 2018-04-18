'use strict';

const { BAD_REQUEST, NO_CONTENT, NOT_FOUND } = require('http-status');
const pick = require('lodash/pick');
const { createError } = require('../common/errors');
const { School } = require('../common/database');
const districtImport = require('../district/import');

const allowedAttrs = ['name', 'state', 'level', 'type', 'status'];

function list({ query: { districtId } }, res) {
  const where = districtId ? { districtId } : {};
  return School.findAll({ where, include: [ 'district' ] })
    .then(schools => res.jsend.success(schools));
}

function patch({ params, body }, res) {
  return School.findById(params.id, { paranoid: false })
    .then(school => school || createError(NOT_FOUND, 'School does not exist!'))
    .then(school => school.update(pick(body, allowedAttrs)))
    .then(school => res.jsend.success(school));
}

function destroy({ params: { id } }, res) {
  if (!id) return res.sendStatus(BAD_REQUEST);
  return School.destroy({ where: { id } })
    .then(deletedCount => {
      if (deletedCount) return res.sendStatus(NO_CONTENT);
      throw new Error('Delete failed!');
    });
}

function handleImport({ file }, res) {
  if (!file) return res.sendStatus(BAD_REQUEST);
  // TODO: validate file
  return districtImport(file.path)
    .then(data => res.jsend.success(data));
}

module.exports = {
  list,
  patch,
  destroy,
  handleImport
};
