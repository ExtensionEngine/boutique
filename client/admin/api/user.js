import { extractData, processParams } from '@/common/api/helpers';
import request from '@/common/api/request';

const url = {
  fetch: '/users'
};

function fetch(params = {}) {
  return request.get(url.fetch, { params: processParams(params) })
    .then(extractData);
}

export default {
  fetch
};
