'use strict';

const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const deleteFile = promisify(fs.unlink);

router
  .post('/', createPreview)
  .get('/:containerId', fetchPreview);

async function createPreview(req, res) {
  const filePath = path.join(__dirname, `${req.body.id}.json`);
  await writeJsonFile(filePath, req.body);
  return res.redirect(`/#/previewComponent/${req.body.id}`);
}

async function fetchPreview(req, res) {
  const { containerId } = req.params;
  const filePath = path.join(__dirname, `${containerId}.json`);
  const data = await readJsonFile(filePath);
  deleteFile(filePath);
  return res.jsend.success(data);
}

function writeJsonFile(path, content) {
  return writeFile(path, JSON.stringify(content));
}

function readJsonFile(path) {
  return readFile(path, 'utf8').then(data => JSON.parse(data));
}

module.exports = {
  path: '/preview',
  router
};
