import auth from '@/common/store/modules/auth';
import { auth as authPlugin } from '@/common/store/plugins';
import contentRepo from '@/admin/store/modules/content-repo';
import programs from '@/admin/store/modules/programs';
import Vue from 'vue';
import Vuex from 'vuex';

const MUTATION_TYPE = 'auth/login';
const isProduction = process.env.NODE_ENV === 'production';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    contentRepo,
    programs
  },
  plugins: [authPlugin(MUTATION_TYPE)],
  strict: !isProduction
});
