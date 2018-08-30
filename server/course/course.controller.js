'use strict';

const { Course } = require('../common/database');
const config = require('../config');
const createStorage = require('../common/storage');
const pick = require('lodash/pick');

const Storage = createStorage(config.storage);
const outputAttributes =
  ['id', 'sourceId', 'programLevelId', 'name', 'publishedAt', 'updatedAt'];
const processInput = input => pick(input, ['sourceId', 'programLevelId']);
const processOutput = output => pick(output, outputAttributes);

function list({ query: { programLevelId } }, res) {
  return Course.findAll({ where: { programLevelId },
    attributes: outputAttributes })
    .then(courses => res.jsend.success(courses));
}

function getCatalog(req, res) {
  return Storage.getCatalog()
    .then(data => res.jsend.success(data));
}

function create({ body }, res) {
  const data = processInput(body);
  const attributes =
    ['uid', 'schema', 'name', 'structure', 'description', 'publishedAt'];
  return Storage.getRepository(data.sourceId)
    .then(repository => {
      repository.structure = JSON.stringify(repository.structure);
      Object.assign(data, pick(repository, attributes));
      return Course.create(data);
    })
    .then(course => res.jsend.success(processOutput(course)));
}

module.exports = {
  list,
  getCatalog,
  create
};
