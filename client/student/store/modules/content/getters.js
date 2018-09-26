import concat from 'lodash/concat';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import split from 'lodash/split';

const filterBy = 'DEFAULT_SCHEMA/TOPIC';
const filterBySplitted = split(filterBy, '/');
const filterBySchema = get(filterBySplitted, 0, '');
const filterByActivity = get(filterBySplitted, 1, '');

export const getContent = state => {
  let content = [];
  forEach(filter(state.items, { schema: filterBySchema }), course => {
    if (!filterByActivity) return content.push(course);
    content = concat(content, filter(course.structure, { type: filterBy }));
  });
  return content;
};
