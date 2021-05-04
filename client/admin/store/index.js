import auth from '@/common/store/modules/auth';
import contentRepo from '@/admin/store/modules/content-repo';
import programs from '@/admin/store/modules/programs';
import Vue from 'vue';
import Vuex from 'vuex';

const isProduction = process.env.NODE_ENV === 'production';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    auth,
    contentRepo,
    programs
  },
  strict: !isProduction
});

export default function getStore() {
  return store.dispatch('auth/fetchUserInfo')
    .then(() => store);
}
