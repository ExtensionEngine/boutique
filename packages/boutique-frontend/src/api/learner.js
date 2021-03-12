import { extractData } from '@/common/api/helpers';
import request from '@/common/api/request';

const urls = {
  programs: () => '/programs/current-user'
};

function fetchPrograms() {
  return request.get(urls.programs()).then(extractData);
}

export default {
  fetchPrograms
};
