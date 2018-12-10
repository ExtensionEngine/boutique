import { extractData } from '@/common/api/helpers';
import request from '@/common/api/request';

const url = {
  catalog: '/content-repo/catalog',
  restore: '/content-repo/restore',
  resource: id => `/content-repo/${id}`
};

function getCatalog() {
  return request.get(url.catalog).then(extractData);
}

function patch(item) {
  return request.patch(url.resource(item.id), item);
}

function restore(item) {
  return request.post(url.restore, item);
}

export default {
  getCatalog,
  restore,
  patch
};
