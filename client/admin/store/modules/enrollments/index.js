import * as actions from './actions';
import * as mutations from './mutations';

const state = {
  items: {},
  $apiUrl: '/enrollments'
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
