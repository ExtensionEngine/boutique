import auth from '@/common/store/modules/auth';
import learner from '@/main/store/modules/learner';
import Vue from 'vue';
import Vuex from 'vuex';

const isProduction = process.env.NODE_ENV === 'production';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    auth,
    learner
  },
  strict: !isProduction
});

export default function getStore() {
  return store.dispatch('auth/fetchUserInfo')
    .then(() => store);
}
