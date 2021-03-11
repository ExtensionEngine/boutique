import { extractData } from '@/common/api/helpers';
import path from 'path';
import request from '@/common/api/request';

const urls = {
  root: '/content-repo',
  catalog: () => path.join(urls.root, 'catalog'),
  resource: id => path.join(urls.root, String(id)),
  restore: id => path.join(urls.root, String(id), 'restore')
};

function getCatalog() {
  return request.get(urls.catalog()).then(extractData);
}

function archive(item) {
  return request.delete(urls.resource(item.id));
}

function restore(item) {
  return request.post(urls.restore(item.id));
}

export default {
  getCatalog,
  archive,
  restore
};
