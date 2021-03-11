import { extractData, processParams } from '@/common/api/helpers';
import get from 'lodash/get';
import path from 'path';
import request from '@/common/api/request';

const urls = {
  root: '/users',
  resource: id => path.join(urls.root, String(id)),
  invite: id => path.join(urls.resource(id), 'invite'),
  import: () => path.join(urls.root, 'import'),
  getImportTemplate: () => path.join(urls.import(), 'template')
};

function fetch(params = {}) {
  return request.get(urls.root, { params: processParams(params) })
    .then(extractData);
}

function create(item) {
  return request.post(urls.root, item).then(extractData);
}

function update(item) {
  return request.patch(urls.resource(item.id), item).then(extractData);
}

function remove(item) {
  return request.delete(urls.resource(item.id));
}

function invite(item) {
  return request.post(urls.invite(item.id));
}

async function bulkImport(items) {
  const options = { responseType: 'blob' };
  const { data, headers } = await request.post(urls.import(), items, options);
  return { data, count: parseInt(get(headers, 'data-imported-count'), 10) };
}

function getImportTemplate() {
  return request.get(urls.getImportTemplate(), { responseType: 'blob' });
}

export default {
  fetch,
  create,
  update,
  remove,
  invite,
  bulkImport,
  getImportTemplate
};
