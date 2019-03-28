'use strict';

const { promisify } = require('util');
const { storage } = require('../config');
const fs = require('fs');
const mkdirp = promisify(require('mkdirp'));
const path = require('path');

const previewPath = path.join(storage.filesystem.path, storage.previewPath);

async function createPreview(req, res) {
  const filePath = path.join(previewPath, `${req.body.uid}.json`);
  await mkdirp(previewPath);
  await writeJsonFile(filePath, req.body);
  return res.jsend.success({ url: `/#/previewComponent/${req.body.uid}` });
}

async function fetchPreview(req, res) {
  const filePath = path.join(previewPath, `${req.params.containerId}.json`);
  const data = await readJsonFile(filePath);
  promisify(fs.unlink)(filePath);
  return res.jsend.success(data);
}

module.exports = {
  createPreview,
  fetchPreview
};

function writeJsonFile(path, content) {
  return promisify(fs.writeFile)(path, JSON.stringify(content), 'utf8');
}

function readJsonFile(path) {
  return promisify(fs.readFile)(path, 'utf8').then(data => JSON.parse(data));
}
