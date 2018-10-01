import auth from '@/common/store/modules/auth';
import learner from '@/student/store/modules/learner';
import plugins from '@/common/store/plugins';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    learner
  },
  plugins
});
