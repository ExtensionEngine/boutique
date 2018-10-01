import request from '@/common/api/request';

const extractData = res => res.data.data;

const url = {
  programs: '/enrollments'
};

function fetchPrograms(studentId) {
  const params = { studentId, includeCohort: true };
  return request.get(url.programs, { params }).then(extractData);
}

export default {
  fetchPrograms
};
