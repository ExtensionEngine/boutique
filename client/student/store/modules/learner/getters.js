import filter from 'lodash/filter';
import map from 'lodash/map';
import pick from 'lodash/pick';
import reduce from 'lodash/reduce';

const CARD_ACTIVITY = 'DEFAULT_SCHEMA/COMPETENCY';
const CARD_SUBACTIVITIES = ['DEFAULT_SCHEMA/TOPIC'];

function processActivities(syllabus) {
  return reduce(syllabus, (acc, repository) => {
    return acc.concat(map(repository.structure, it => ({
      ...pick(it, ['id', 'parentId', 'type']),
      ...it.meta,
      repositoryId: repository.id,
      contentContainers: filter(it.contentContainers, it => it.elementCount)
    })));
  }, []);
}

function processRepositories(syllabus) {
  return map(syllabus, repository => ({
    ...pick(repository, ['id', 'schema', 'name', 'description']),
    repositoryId: repository.id
  }));
}

const getSubactivities = (activity, structure) => {
  const children = filter(structure, { parentId: activity.id });
  const targetNodes = filter(children, it => CARD_SUBACTIVITIES.includes(it.type));
  if (targetNodes.length) return targetNodes;
  return reduce(children, (acc, it) => acc.concat(getSubactivities(it, structure)), []);
};

export const courseware = state => {
  const activities = processActivities(state.syllabus);
  const temp = CARD_ACTIVITY.includes('/')
    ? filter(activities, { type: CARD_ACTIVITY })
    : filter(processRepositories(state.syllabus), { schema: CARD_ACTIVITY });
  temp.forEach(it => {
    it.subActivites = CARD_SUBACTIVITIES.includes(CARD_ACTIVITY)
      ? []
      : getSubactivities({ id: it.schema ? null : it.id }, activities);
    it.subActivites = filter(it.subActivites, it => it.contentContainers.length);
  });
  return filter(temp, it => it.subActivites.length);
};
