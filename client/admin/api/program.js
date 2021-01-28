import { extractData, processParams } from '@/common/api/helpers';
import request from '@/common/api/request';

const urls = {
  root: '/programs'
};

function fetch(params = {}) {
  return request.get(urls.root, { params: processParams(params) })
    .then(extractData);
}

export default { fetch };
