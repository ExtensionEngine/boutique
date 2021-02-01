import { extractData, processParams } from '@/common/api/helpers';
import request from '@/common/api/request';

const urls = {
  root: '/user-groups'
};

function fetch(params = {}) {
  return request.get(urls.root, { params: processParams(params) })
    .then(extractData);
}

function create(item) {
  return request.post(urls.root, item).then(extractData);
}

export default { fetch, create };
