import * as actions from './actions';
import * as mutations from './mutations';

const state = {
  items: {},
  $apiUrl: '/districts'
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters: {
    // TODO: extract into file
    array: state => Object.values(state.items)
  }
};
