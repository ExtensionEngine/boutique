'use strict';

const { ContentRepo } = require('../common/database');
const config = require('../config');
const createStorage = require('../common/storage');
const forEach = require('lodash/forEach');
const keyBy = require('lodash/keyBy');
const pick = require('lodash/pick');

const Storage = createStorage(config.storage);
const inputAttributes = ['contentRepoId', 'sourceId', 'programLevelId'];
const outputAttributes =
  ['id', 'sourceId', 'programLevelId', 'name', 'publishedAt'];
const processInput = input => pick(input, inputAttributes);

function list({ query: { programLevelId } }, res) {
  return ContentRepo.findAll({ where: { programLevelId },
    attributes: outputAttributes })
    .then(contentRepoList => {
      return Storage.getCatalog().then(data => {
        const catalogData = keyBy(data, value => value.id);
        forEach(contentRepoList, contentRepo => {
          const repoVersion = catalogData[contentRepo.sourceId].publishedAt;
          contentRepo.setDataValue('repoVersion', repoVersion);
        });
        return res.jsend.success(contentRepoList);
      });
    });
}

function getCatalog(req, res) {
  return Storage.getCatalog()
    .then(data => res.jsend.success(data));
}

function createOrUpdate({ body, params }, res) {
  const data = processInput(body);
  const contentRepoId = params.id;
  const attributes =
    ['uid', 'schema', 'name', 'structure', 'description', 'publishedAt'];
  return Storage.getRepository(data.sourceId)
    .then(repository => {
      Object.assign(data, pick(repository, attributes));
      return Storage.syncRepository(data)
        .then(() => ({ repository, data }));
    })
    .then(({ repository, data }) => {
      return ContentRepo.findOrCreate({
        where: { id: contentRepoId }, defaults: data
      })
        .spread((contentRepo, created) => {
          if (!created) contentRepo.update(data);
          const contentRepoData = pick(contentRepo, outputAttributes);
          contentRepoData.repoVersion = repository.publishedAt;
          return res.jsend.success(contentRepoData);
        });
    });
}

module.exports = {
  list,
  getCatalog,
  createOrUpdate
};
