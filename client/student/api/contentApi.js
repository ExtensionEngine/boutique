import request from '@/common/api/request';

const extractData = res => res.data.data;

function getContainer(cohortId, courseId, containerId) {
  const url =
    `/cohorts/${cohortId}/content/${courseId}/container/${containerId}`;
  return request.get(url).then(extractData);
}

export default {
  getContainer
};
