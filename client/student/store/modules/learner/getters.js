import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import head from 'lodash/head';

const FILTER_BY = 'DEFAULT_SCHEMA/TOPIC';

export const courseware = state => {
  let courseware = filter(state.syllabus, { schema: FILTER_BY });
  if (!courseware.length) {
    forEach(state.syllabus, course => {
      forEach(filter(course.structure, { type: FILTER_BY }), it => {
        const headContainer = head(it.contentContainers);
        if (headContainer.elementCount) {
          courseware.push({
            ...it.meta,
            container: headContainer,
            parentId: it.parentId,
            courseId: course.id
          });
        }
      });
    });
  }
  return courseware;
};
