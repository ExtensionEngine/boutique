import filter from 'lodash/filter';
import map from 'lodash/map';
import pick from 'lodash/pick';
import reduce from 'lodash/reduce';

const CARD_ACTIVITY = 'DEFAULT_SCHEMA/COMPETENCY';
const CARD_SUBACTIVITIES = ['DEFAULT_SCHEMA/TOPIC'];
const LIST_REPOSITORIES = !CARD_ACTIVITY.includes('/');

export const isSingleLevel = () => CARD_SUBACTIVITIES.includes(CARD_ACTIVITY);

export const courseware = state => {
  const activities = processActivities(state.syllabus);
  const items = LIST_REPOSITORIES
    ? processRepositories(state.syllabus)
    : filter(activities, { type: CARD_ACTIVITY });
  items.forEach(it => {
    const parentId = LIST_REPOSITORIES ? null : it.id;
    it.subActivities = getSubActivities({ id: parentId }, activities);
    it.subActivities = filter(it.subActivities, it => it.contentContainers.length);
  });
  const filterCond = isSingleLevel() ? 'contentContainers' : 'subActivities';
  return filter(items, it => it[filterCond].length);
};

function processRepositories(syllabus) {
  return map(syllabus, repository => ({
    repositoryId: repository.id,
    ...pick(repository, ['name', 'description'])
  }));
}

function processActivities(syllabus) {
  return reduce(syllabus, (acc, repository) => {
    return acc.concat(map(repository.structure, it => ({
      ...pick(it, ['id', 'parentId', 'type']),
      ...it.meta,
      repositoryId: repository.id,
      contentContainers: filter(it.contentContainers, 'elementCount')
    })));
  }, []);
}

const getSubActivities = (activity, structure) => {
  if (isSingleLevel()) return [];
  const children = filter(structure, { parentId: activity.id });
  const targetNodes = filter(children, it => CARD_SUBACTIVITIES.includes(it.type));
  if (targetNodes.length) return targetNodes;
  return reduce(children,
    (acc, it) => acc.concat(getSubActivities(it, structure)), []);
};
