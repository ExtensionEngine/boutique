import { extractData } from '@/common/api/helpers';
import path from 'path';
import request from '@/common/api/request';

const urls = {
  preview: id => path.join('preview', String(id)),
  root: programId => path.join('programs', String(programId), 'content'),
  syllabus: programId => urls.root(programId),
  contentContainer: (programId, repositoryId, id) => {
    return path.join(urls.root(programId), String(repositoryId), 'container', String(id));
  }
};

function fetchSyllabus(programId) {
  const params = { includeStructure: true };
  return request.get(urls.syllabus(programId), { params }).then(extractData);
}

function getContainer(programId, repositoryId, id) {
  const containerUrl = urls.contentContainer(programId, repositoryId, id);
  return request.get(containerUrl).then(extractData);
}

function getPreview(id) {
  return request.get(urls.preview(id)).then(extractData);
}

export default {
  fetchSyllabus,
  getContainer,
  getPreview
};
