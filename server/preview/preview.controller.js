'use strict';

const { Preview } = require('../common/database');

async function getPreviewUrl({ body }, res) {
  const { id } = await Preview.create({ content: { ...body } });
  res.json({ url: `/#/preview/${id}` });
}

async function getActivity({ params }, res) {
  const { id } = params;
  const preview = await Preview.findByPk(id);
  res.jsend.success(preview.content);
  return preview.destroy();
}

module.exports = {
  getPreviewUrl,
  getActivity
};
