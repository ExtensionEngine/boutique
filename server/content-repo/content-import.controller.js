'use strict';

const { ContentRepo } = require('../common/database');
const forEach = require('lodash/forEach');
const keyBy = require('lodash/keyBy');
const pick = require('lodash/pick');
const { import: contentProcessor } = require('./processor');

const outputAttributes = [
  'id', 'sourceId', 'programId', 'name', 'publishedAt', 'deletedAt'
];

async function list({ query: { programId, srcVersion = false, archived } }, res) {
  const repos = await ContentRepo.findAll({
    where: { programId },
    attributes: outputAttributes,
    paranoid: !archived
  });
  if (srcVersion) {
    const reposById = keyBy(await contentProcessor.getCatalog(), 'id');
    forEach(repos, it => {
      it.setDataValue('repoVersion', reposById[it.sourceId].publishedAt);
    });
  }
  return res.jsend.success(repos);
}

function getCatalog(req, res) {
  return contentProcessor.getCatalog().then(data => res.jsend.success(data));
}

async function upsert({ body }, res) {
  const data = pick(body, ['id', 'sourceId', 'programId']);
  const srcRepo = await contentProcessor.importRepo(data.programId, data.sourceId);
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

function destroy({ params }, res) {
  return ContentRepo.destroy({ where: { id: params.id } })
    .then(() => res.end());
}

function restore({ params }, res) {
  return ContentRepo.restore({ where: { id: params.id } })
    .then(() => res.end());
}

module.exports = {
  list,
  getCatalog,
  upsert,
  destroy,
  restore
};
