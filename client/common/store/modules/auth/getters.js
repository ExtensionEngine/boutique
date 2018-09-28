import get from 'lodash/get';

const isAdmin = state => get(state, 'user.role') === 'ADMIN';

const userCohortId = state => get(state, 'user.cohortId');

export { isAdmin, userCohortId };
