import { extractData, processParams } from '@/common/api/helpers';
import request from '@/common/api/request';

const url = {
  root: '/enrollments',
  resource: it => `/enrollments/${it.id}`,
  bulkEnroll: '/enrollments/bulkEnroll'
};

function fetch(opts) {
  return request.get(url.root, { params: processParams(opts) })
    .then(extractData);
}

function create(item) {
  return request.post(url.root, item).then(extractData);
}

function bulkEnroll(items) {
  return request.post(url.bulkEnroll, items).then(extractData);
}

function remove(item) {
  return request.delete(url.resource(item));
}

export default {
  fetch,
  create,
  bulkEnroll,
  remove
};
