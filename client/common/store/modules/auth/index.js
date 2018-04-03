import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

const state = {
  user: JSON.parse(window.localStorage.getItem('LMS_USER') || null)
};

export default {
  state,
  getters,
  actions,
  mutations
};
