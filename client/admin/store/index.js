import Vue from 'vue';
import Vuex from 'vuex';

import auth from '@/common/store/modules/auth';
import plugins from '@/common/store/plugins';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth
  },
  plugins
});
