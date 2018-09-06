'use strict';

const { ContentRepo } = require('../common/database');
const config = require('../config');
const createStorage = require('../common/storage');
const forEach = require('lodash/forEach');
const keyBy = require('lodash/keyBy');
const pick = require('lodash/pick');

const Storage = createStorage(config.storage);
const processInput = input => pick(input,
  ['contentRepoId', 'sourceId', 'programLevelId']);
const outputAttributes = [
  'id', 'sourceId', 'programLevelId', 'name', 'publishedAt'
];

async function list({ query: { programLevelId, srcVersion = false } }, res) {
  const opts = { where: { programLevelId }, attributes: outputAttributes };
  const repos = await ContentRepo.findAll(opts);
  if (srcVersion) {
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

async function upsert({ body }, res) {
  const data = processInput(body);
  const srcRepo = await Storage.importRepo(data.programLevelId, data.sourceId);
  const dstRepo = await ContentRepo.createOrUpdate(data.contentRepoId, {
    ...data,
    ...pick(srcRepo, [
      'uid', 'schema', 'name', 'structure', 'description', 'publishedAt'])
  });
  return res.jsend.success({
    ...pick(dstRepo, outputAttributes),
    repoVersion: dstRepo.publishedAt
  });
}

module.exports = {
  list,
  getCatalog,
  upsert
};
