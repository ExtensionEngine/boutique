import { extractData } from '@/common/api/helpers';
import request from '@/common/api/request';

function getPreview(containerId) {
  return request.get(`/preview/${containerId}`).then(extractData);
}

export default {
  getPreview
};
