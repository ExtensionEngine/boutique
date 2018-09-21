import * as actions from './actions';
import * as mutations from './mutations';

const state = {
  items: {},
  $apiUrl: '/cohorts/1/content'
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
