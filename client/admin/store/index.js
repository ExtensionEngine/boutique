import Vue from 'vue';
import Vuex from 'vuex';

import auth from '@/common/store/modules/auth';
import enrollments from '@/admin/store/modules/enrollments';
import plugins from '@/common/store/plugins';
import programLevels from '@/admin/store/modules/program-levels';
import programs from '@/admin/store/modules/programs';
import users from '@/admin/store/modules/users';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    enrollments,
    programLevels,
    programs,
    users
  },
  plugins
});
