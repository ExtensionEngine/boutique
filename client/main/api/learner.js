import { extractData } from '@/common/api/helpers';
import path from 'path';
import request from '@/common/api/request';

const urls = {
  programs: () => path.join('programs', 'current-user')
};

function fetchPrograms() {
  return request.get(urls.programs()).then(extractData);
}

export default {
  fetchPrograms
};
