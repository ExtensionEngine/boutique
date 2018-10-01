import request from '@/common/api/request';

const extractData = res => res.data.data;

const url = {
  programs: '/enrollments',
  syllabus: programId => `/cohorts/${programId}/content`
};

function fetchPrograms(studentId) {
  return request.get(url.programs, { params: { studentId } }).then(extractData);
}

function fetchSyllabus(programId) {
  return request.get(
    url.syllabus(programId),
    { params: { includeStructure: true } })
  .then(extractData);
}

export default {
  fetchPrograms,
  fetchSyllabus
};
