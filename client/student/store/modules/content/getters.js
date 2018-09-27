import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import head from 'lodash/head';
import split from 'lodash/split';

const filterBy = 'DEFAULT_SCHEMA/TOPIC';
const filterBySplitted = split(filterBy, '/');
const filterBySchema = get(filterBySplitted, 0, '');
const filterByActivity = get(filterBySplitted, 1, '');

const getContent = state => {
  let content = [];
  forEach(filter(state.items, { schema: filterBySchema }), course => {
    if (!filterByActivity) return content.push(course);
    forEach(filter(course.structure, { type: filterBy }), it => {
      content.push({ ...it, courseId: course.id });
    });
  });
  return content;
};

const getCourseId = state => containerId => {
  const content = getContent(state);
  return get(head(filter(content, it => {
    return get(head(it.contentContainers), 'id', '') === containerId;
  })), 'courseId', '');
};

const getSiblings = state => containerId => {
  const content = getContent(state);
  const parentId = get(head(filter(content, it => {
    return get(head(it.contentContainers), 'id', '') === containerId;
  })), 'parentId', '');
  return filter(content, { parentId });
};

export {
  getContent,
  getCourseId,
  getSiblings
};
