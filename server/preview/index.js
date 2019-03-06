'use strict';

const router = require('express').Router();
const fs = require('fs');

router
  .post('/preview', getPreview);

function getPreview(req, res) {
  const path = `${__dirname}/../../common/${req.body.id}.json`;
  const data = JSON.stringify(req.body);
  fs.writeFileSync(path, data);
  return res.redirect(`/#/previewComponent/${req.body.id}`);
}

module.exports = { router };
