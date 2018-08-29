'use strict';

const { Course } = require('../common/database');
const config = require('../config');
const createStorage = require('../common/storage');
const pick = require('lodash/pick');

const Storage = createStorage(config.storage);
const processInput = input => pick(input, ['courseId', 'programLevelId']);

function list(req, res) {
  return Course.findAll()
    .then(courses => res.jsend.success(courses));
}

function getCatalog(req, res) {
  return Storage.getCatalog()
    .then(data => res.jsend.success(data));
}

function create({ body }, res) {
  const data = processInput(body);
  const attributes = ['name', 'structure', 'schema', 'description'];
  return Storage.getRepository(data.courseId)
    .then(repository => {
      repository.structure = JSON.stringify(repository.structure);
      Object.assign(data, pick(repository, attributes));
      return Course.create(data);
    })
    .then(course => res.jsend.success(course));
}

module.exports = {
  list,
  getCatalog,
  create
};
