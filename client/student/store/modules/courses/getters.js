import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import pick from 'lodash/pick';
import split from 'lodash/split';

const filterBy = 'DEFAULT_SCHEMA/TOPIC';
const filterBySplitted = split(filterBy, '/');
const filterBySchema = get(filterBySplitted, 0, '');
const filterByActivity = get(filterBySplitted, 1, '');

export const getContent = state => {
  let content = [];
  const attributes = ['name', 'description'];
  forEach(filter(state.items, { schema: filterBySchema }), course => {
    if (!filterByActivity) return content.push(pick(course, attributes));
    forEach(filter(course.structure, { type: filterBy }), activity => {
      content.push({
        name: activity.meta.name,
        description: activity.type
      });
    });
  });
  return content;
};
