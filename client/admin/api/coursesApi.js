import request from '@/common/api/request';

const url = {
  catalog: '/courses/catalog',
  sync: 'courses/sync'
};

function getCatalog() {
  return request.get(url.catalog);
}

function syncCourse(courseId, programLevelId, sourceId) {
  return request.post(url.sync, { courseId, programLevelId, sourceId });
}

export default {
  getCatalog,
  syncCourse
};
