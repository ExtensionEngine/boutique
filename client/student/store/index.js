import auth from '@/common/store/modules/auth';
import courses from '@/student/store/modules/courses';
import plugins from '@/common/store/plugins';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    courses
  },
  plugins
});
