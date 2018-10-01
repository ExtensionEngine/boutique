import get from 'lodash/get';

const isAdmin = state => get(state, 'user.role') === 'ADMIN';

const userId = state => get(state, 'user.id');

const userCohortId = state => get(state, 'user.cohortId');

export { isAdmin, userCohortId, userId };
