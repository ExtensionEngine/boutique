import { extractData } from '@/common/api/helpers';
import request from '@/common/api/request';

const url = {
  catalog: '/content-repo/catalog',
  resource: id => `/content-repo/${id}`,
  restore: id => `content-repo/${id}/restore`
};

function getCatalog() {
  return request.get(url.catalog).then(extractData);
}

function patch(item) {
  return request.patch(url.resource(item.id), item);
}

function archive(item) {
  return request.delete(url.resource(item.id));
}

function restore(item) {
  return request.post(url.restore(item.id));
}

export default {
  getCatalog,
  archive,
  restore,
  patch
};
