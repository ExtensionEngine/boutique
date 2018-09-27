import * as actions from './actions';
import * as mutations from './mutations';

const state = {
  items: {},
  $apiUrl: '/cohorts/0/content/0/container'
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
