import concat from 'lodash/concat';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import head from 'lodash/head';

const filterBy = 'DEFAULT_SCHEMA/TOPIC';

export const courseware = state => {
  let courseware = concat([], filter(state.syllabus, { schema: filterBy }));
  if (!courseware.length) {
    forEach(state.syllabus, course => {
      forEach(filter(course.structure, { type: filterBy }), it => {
        courseware.push({
          ...it.meta,
          container: head(it.contentContainers),
          parentId: it.parentId,
          courseId: course.id
        });
      });
    });
  }
  return courseware;
};
