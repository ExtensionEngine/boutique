import { extractData, processParams } from './helpers';
import request from '@/common/api/request';

const url = {
  root: '/users',
  resource: it => `/users/${it.id}`
};

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

export default {
  fetch,
  create,
  update
};
