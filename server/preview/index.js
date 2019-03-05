'use strict';

const router = require('express').Router();

router
  .get('/preview/:programId/:repositoryId/:containerId', getPreview);

function getPreview(req, res) {
  const { programId, repositoryId, containerId } = req.params;
  return res.redirect(`/#/previewComponent/${programId}/${repositoryId}/${containerId}`);
}

module.exports = { router };
