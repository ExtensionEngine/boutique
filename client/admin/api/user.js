import { extractData, processParams } from '@/common/api/helpers';
import request from '@/common/api/request';

const url = {
  root: '/users',
  profile: '/users/me',
  resource: it => `/users/${it.id}`,
  invite: it => `/users/${it.id}/invite`,
  import: '/users/import'
};

function getProfile(token) {
  const params = {};
  if (token) params.token = token;
  return request.get(url.profile, { params }).then(extractData);
}

function fetch(params = {}) {
  return request.get(url.root, { params: processParams(params) })
    .then(extractData);
}

function create(item) {
  return request.post(url.root, item).then(extractData);
}

function update(item) {
  return request.patch(url.resource(item), item).then(extractData);
}

function remove(item) {
  return request.delete(url.resource(item));
}

function invite(item) {
  return request.post(url.invite(item));
}

function bulkImport(items) {
  return request.post(url.import, items, { responseType: 'blob' });
}

export default {
  getProfile,
  fetch,
  create,
  update,
  remove,
  invite,
  bulkImport
};
