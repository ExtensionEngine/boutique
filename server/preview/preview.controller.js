'use strict';

const { Preview } = require('../common/database');

async function getPreviewUrl({ body }, res) {
  const { id } = await Preview.create({ content: { ...body } });
  res.json({ url: `/#/preview/${id}` });
}

async function getActivity({ params }, res) {
  const { id } = params;
  const { content } = await Preview.findByPk(id);
  res.jsend.success(content);
}

module.exports = {
  getPreviewUrl,
  getActivity
};
