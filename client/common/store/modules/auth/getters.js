import get from 'lodash/get';

export const isAdmin = state => get(state, 'user.role') === 'ADMIN';

export const getUserCohort = state => get(state, 'user.cohortId');
