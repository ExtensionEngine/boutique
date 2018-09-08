import auth from '@/common/store/modules/auth';
import cohorts from '@/admin/store/modules/cohorts';
import contentRepo from '@/admin/store/modules/content-repo';
import enrollments from '@/admin/store/modules/enrollments';
import plugins from '@/common/store/plugins';
import users from '@/admin/store/modules/users';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    contentRepo,
    enrollments,
    cohorts,
    users
  },
  plugins
});
