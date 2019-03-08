'use strict';

const router = require('express').Router();
const fs = require('fs');
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

router
  .post('/preview', postPreview)
  .get('/preview/:containerId', getPreview);

async function postPreview(req, res) {
  const path = `${__dirname}/${req.body.id}.json`;
  await writeFile(path, JSON.stringify(req.body));
  return res.redirect(`/#/previewComponent/${req.body.id}`);
}

async function getPreview(req, res) {
  const { containerId } = req.params;
  const path = `${__dirname}/${containerId}.json`;
  const data = await readFile(path, 'utf8');
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
  return res.jsend.success(JSON.parse(data));
}

module.exports = { router };
