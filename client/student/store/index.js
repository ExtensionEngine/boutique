import auth from '@/common/store/modules/auth';
import containers from '@/student/store/modules/containers';
import content from '@/student/store/modules/content';
import plugins from '@/common/store/plugins';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    containers,
    content
  },
  plugins
});
