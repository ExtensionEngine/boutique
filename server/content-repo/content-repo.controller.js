'use strict';

const { ContentRepo } = require('../common/database');
const config = require('../config');
const createStorage = require('../common/storage');
const forEach = require('lodash/forEach');
const keyBy = require('lodash/keyBy');
const pick = require('lodash/pick');

const Storage = createStorage(config.storage);
const inputAttributes = ['contentRepoId', 'sourceId', 'programLevelId'];
const outputAttributes = [
  'id', 'sourceId', 'programLevelId', 'name', 'publishedAt'
];
const processInput = input => pick(input, inputAttributes);

async function list({ query: { programLevelId, includeVersion = false } }, res) {
  const opts = { where: { programLevelId }, attributes: outputAttributes };
  const repos = await ContentRepo.findAll(opts);
  if (includeVersion) {
    const reposById = keyBy(await Storage.getCatalog(), 'id');
    forEach(repos, it => {
      it.setDataValue('repoVersion', reposById[it.sourceId].publishedAt);
    });
  }
  return res.jsend.success(repos);
}

function getCatalog(req, res) {
  return Storage.getCatalog()
    .then(data => res.jsend.success(data));
}

async function upsert({ body, params: { id: contentRepoId } }, res) {
  const data = processInput(body);
  const srcRepo = await Storage.importRepo(data);
  const dstRepo = await ContentRepo.upsertRepo(contentRepoId, {
    ...data,
    ...pick(srcRepo, [
      'uid', 'schema', 'name', 'structure', 'description', 'publishedAt'])
  });
  return res.jsend.success({
    ...pick(dstRepo, outputAttributes),
    repoVersion: srcRepo.publishedAt
  });
}

module.exports = {
  list,
  getCatalog,
  upsert
};
