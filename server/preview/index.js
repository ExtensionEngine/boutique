'use strict';

const router = require('express').Router();
const fs = require('fs');
var path = require('path');
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const deleteFile = promisify(fs.unlink);

router
  .post('/', createPreview)
  .get('/:containerId', fetchPreview);

async function createPreview(req, res) {
  const filePath = path.join(__dirname, req.body.id + '.json');
  await writeFile(filePath, JSON.stringify(req.body));
  return res.redirect(`/#/previewComponent/${req.body.id}`);
}

async function fetchPreview(req, res) {
  const { containerId } = req.params;
  const filePath = path.join(__dirname, containerId + '.json');
  const data = await readFile(filePath, 'utf8');
  deleteFile(filePath);
  return res.jsend.success(JSON.parse(data));
}

module.exports = {
  path: '/preview',
  router
};
