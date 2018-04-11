import * as actions from './actions';
import * as mutations from './mutations';

const state = {
  items: {},
  $apiUrl: '/users'
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
