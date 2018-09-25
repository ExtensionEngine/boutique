import * as actions from './actions';
import * as mutations from './mutations';

const state = {
  items: {},
  $apiUrl: '/cohorts/1/content/4/container'
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
