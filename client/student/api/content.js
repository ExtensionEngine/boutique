import { extractData } from '@/common/api/helpers';
import request from '@/common/api/request';

const url = {
  base: programId => `/cohorts/${programId}/content`,
  syllabus: programId => `${url.base(programId)}`,
  container: (programId, repositoryId, containerId) => {
    return `${url.base(programId)}/${repositoryId}/container/${containerId}`;
  }
};

function fetchSyllabus(programId) {
  const params = { includeStructure: true };
  return request.get(url.syllabus(programId), { params }).then(extractData);
}

function getContainer(programId, repositoryId, containerId) {
  return request.get(url.container(programId, repositoryId, containerId))
    .then(extractData);
}

export default {
  fetchSyllabus,
  getContainer
};
