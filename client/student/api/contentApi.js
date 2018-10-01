import request from '@/common/api/request';

const extractData = res => res.data.data;

const url = {
  syllabus: programId => `/cohorts/${programId}/content`,
  container: (programId, courseId, containerId) => {
    return `/cohorts/${programId}/content/${courseId}/container/${containerId}`;
  }
};

function fetchSyllabus(programId) {
  const params = { includeStructure: true };
  return request.get(url.syllabus(programId), { params }).then(extractData);
}

function getContainer(programId, courseId, containerId) {
  return request.get(url.container(programId, courseId, containerId))
    .then(extractData);
}

export default {
  fetchSyllabus,
  getContainer
};
