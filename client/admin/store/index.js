import Vue from 'vue';
import Vuex from 'vuex';

import auth from '@/common/store/modules/auth';
import plugins from '@/common/store/plugins';
import users from '@/admin/store/modules/users';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    users
  },
  plugins
});
