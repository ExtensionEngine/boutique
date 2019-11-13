import { extractData } from '@/common/api/helpers';
import request from '@/common/api/request';

const url = {
  preview: id => `preview/${id}`,
  root: programId => `/programs/${programId}/content`,
  syllabus: programId => `${url.root(programId)}`,
  contentContainer: (programId, repositoryId, id) => {
    return `${url.root(programId)}/${repositoryId}/container/${id}`;
  }
};

function fetchSyllabus(programId) {
  const params = { includeStructure: true };
  return request.get(url.syllabus(programId), { params }).then(extractData);
}

function getContainer(programId, repositoryId, id) {
  const containerUrl = url.contentContainer(programId, repositoryId, id);
  return request.get(containerUrl).then(extractData);
}

function getPreview(id) {
  return request.get(url.preview(id)).then(extractData);
}

export default {
  fetchSyllabus,
  getContainer,
  getPreview
};
