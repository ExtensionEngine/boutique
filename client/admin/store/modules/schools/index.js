import * as actions from './actions';
import * as mutations from './mutations';

const state = {
  items: {},
  $apiUrl: '/schools'
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
