import { extractData, processParams } from '@/common/api/helpers';
import request from '@/common/api/request';

const url = {
  root: '/groups',
  resource: it => `/groups/${it.id}`
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

function remove(item) {
  return request.delete(url.resource(item));
}

export default {
  fetch,
  create,
  update,
  remove
};
