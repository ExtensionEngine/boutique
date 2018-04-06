import * as actions from './actions';
import * as mutations from './mutations';

const state = {
  users: []
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
