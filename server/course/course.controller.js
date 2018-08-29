'use strict';

const { Course } = require('../common/database');
const config = require('../config');
const createStorage = require('../common/storage');
const pick = require('lodash/pick');
const assign = require('lodash/assign');

const Storage = createStorage(config.storage);
const processInput = input => pick(input, ['courseId', 'programLevelId']);

function list(req, res) {
  return Course.findAll()
  .then(courses => res.jsend.success(courses));
}

function getCatalog(req, res) {
  Storage.getCatalog()
  .then(data => res.jsend.success(data));
}

function create({ body }, res) {
  const data = processInput(body);
  return Storage.getRepository(data.courseId)
    .then(repositoryData => {
      assign(data, (pick(repositoryData, ['name', 'schema', 'description'])));
    })
    .then(() => Course.create(data))
    .then(course => res.jsend.success(course));
}

module.exports = {
  list,
  getCatalog,
  create
};
