import { extractData } from '@/common/api/helpers';
import request from '@/common/api/request';

const url = {
  catalog: '/content-repo/catalog'
};

function getCatalog() {
  return request.get(url.catalog).then(extractData);
}

export default {
  getCatalog
};
