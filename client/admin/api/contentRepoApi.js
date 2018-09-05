import request from '@/common/api/request';

const url = {
  catalog: '/content-repo/catalog'
};

function getCatalog() {
  return request.get(url.catalog).then(data => data.data);
}

export default {
  getCatalog
};
