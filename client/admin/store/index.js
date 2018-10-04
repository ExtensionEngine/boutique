import auth from '@/common/store/modules/auth';
import contentRepo from '@/admin/store/modules/content-repo';
import plugins from '@/common/store/plugins';
import programs from '@/admin/store/modules/programs';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    contentRepo,
    programs
  },
  plugins
});
