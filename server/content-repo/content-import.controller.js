'use strict';

const { ContentRepo } = require('../common/database');
const forEach = require('lodash/forEach');
const keyBy = require('lodash/keyBy');
const pick = require('lodash/pick');
const Storage = require('./content-storage');

const outputAttributes = ['id', 'sourceId', 'programId', 'name', 'publishedAt'];

async function list({ query: { programId, srcVersion = false } }, res) {
  const opts = { where: { programId }, attributes: outputAttributes };
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
  return Storage.getCatalog().then(data => res.jsend.success(data));
}

async function upsert({ body }, res) {
  const data = pick(body, ['id', 'sourceId', 'programId']);
  const srcRepo = await Storage.importRepo(data.programId, data.sourceId);
  const dstRepo = await ContentRepo.createOrUpdate(data.id, {
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
