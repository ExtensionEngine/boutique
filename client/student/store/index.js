import auth from '@/common/store/modules/auth';
import { auth as authPlugin } from '@/common/store/plugins';
import learner from '@/student/store/modules/learner';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const MUTATION_TYPE = 'auth/login';
const isProduction = process.env.NODE_ENV === 'production';

export default new Vuex.Store({
  modules: {
    auth,
    learner
  },
  plugins: [authPlugin(MUTATION_TYPE)],
  strict: !isProduction
});
