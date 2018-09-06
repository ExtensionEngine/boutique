import request from '@/common/api/request';

const url = {
  catalog: '/content-repo/catalog'
};

const extractData = res => res.data.data;

function getCatalog() {
  return request.get(url.catalog).then(extractData);
}

export default {
  getCatalog
};
