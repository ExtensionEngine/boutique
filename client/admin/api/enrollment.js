import { extractData, processParams } from './helpers';
import request from '@/common/api/request';

const url = {
  root: '/enrollments',
  resource: it => `/enrollments/${it.id}`
};

function fetch(opts) {
  return request.get(url.root, { params: processParams(opts) })
    .then(extractData);
}

function create(item) {
  return request.post(url.root, item).then(extractData);
}

export default {
  fetch,
  create
};
