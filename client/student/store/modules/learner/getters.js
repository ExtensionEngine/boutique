import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import head from 'lodash/head';
import pick from 'lodash/pick';
import split from 'lodash/split';

const filterBy = 'DEFAULT_SCHEMA/TOPIC';
const filterBySplitted = split(filterBy, '/');
const filterBySchema = get(filterBySplitted, 0, '');
const filterByActivity = get(filterBySplitted, 1, '');

export const courseware = state => {
  let content = [];
  const attributes = ['name', 'description'];
  forEach(filter(state.syllabus, { schema: filterBySchema }), course => {
    if (!filterByActivity) return content.push(pick(course, attributes));
    forEach(filter(course.structure, { type: filterBy }), it => {
      content.push({
        name: it.meta.name,
        description: it.meta.description,
        container: head(it.contentContainers),
        parentId: it.parentId,
        courseId: course.id
      });
    });
  });
  return content;
};
