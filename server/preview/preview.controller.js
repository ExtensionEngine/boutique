'use strict';

const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const previewPath = 'data/preview';

async function createPreview(req, res) {
  const filePath = path.join(previewPath, `${req.body.id}.json`);
  await writeJsonFile(filePath, req.body);
  return res.redirect(`/#/previewComponent/${req.body.id}`);
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
  return promisify(mkdirp)(previewPath)
  .then(() => promisify(fs.writeFile)(path, JSON.stringify(content), 'utf8'));
}

function readJsonFile(path) {
  return promisify(fs.readFile)(path, 'utf8').then(data => JSON.parse(data));
}
