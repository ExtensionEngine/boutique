import { extractData } from '@/common/api/helpers';
import request from '@/common/api/request';

const url = {
  programs: '/enrollments/current-user'
};

function fetchPrograms() {
  return request.get(url.programs).then(extractData);
}

export default {
  fetchPrograms
};
