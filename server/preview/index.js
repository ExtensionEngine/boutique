'use strict';

const router = require('express').Router();
const fs = require('fs').promises;

router
  .post('/preview', postPreview)
  .get('/preview/:containerId', getPreview);

async function postPreview(req, res) {
  const path = `${__dirname}/${req.body.id}.json`;
  await fs.writeFile(path, JSON.stringify(req.body));
  return res.redirect(`/#/previewComponent/${req.body.id}`);
}

async function getPreview(req, res) {
  const { containerId } = req.params;
  const path = `${__dirname}/${containerId}.json`;
  const data = await fs.readFile(path);
  fs.unlink(path);
  return res.jsend.success(JSON.parse(data));
}

module.exports = { router };
