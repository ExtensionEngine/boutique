import request from '@/common/api/request';

const url = {
  catalog: '/courses/catalog'
};

function getCatalog() {
  return request.get(url.catalog);
}

export default {
  getCatalog
};
