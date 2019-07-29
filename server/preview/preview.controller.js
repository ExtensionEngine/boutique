'use strict';

const createStorage = require('../common/storage');
const path = require('path');
const { storage: storageOpts } = require('../config');

const storage = createStorage(storageOpts);
const { previewPath } = storageOpts;

async function createPreview({ body }, res) {
  const filePath = path.join(previewPath, `${body.uid}.json`);
  await storage.saveItem(filePath, body);
  return res.json({ url: `/#/preview/${body.uid}` });
}

async function fetchPreview({ params }, res) {
  const filePath = path.join(previewPath, `${params.activityId}.json`);
  const data = await storage.getItem(filePath);
  return res.jsend.success(data);
}

module.exports = {
  createPreview,
  fetchPreview
};
