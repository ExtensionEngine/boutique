import request from '@/common/api/request';

const extractData = res => res.data.data;

const url = {
  programs: '/enrollments/currentUser'
};

function fetchPrograms() {
  return request.get(url.programs).then(extractData);
}

export default {
  fetchPrograms
};
