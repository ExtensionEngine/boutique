import auth from '@/common/store/modules/auth';
import { auth as authPlugin } from '@/common/store/plugins';
import contentRepo from '@/admin/store/modules/content-repo';
import programs from '@/admin/store/modules/programs';
import request from '@/common/api/request';
import Vue from 'vue';
import Vuex from 'vuex';

const isProduction = process.env.NODE_ENV === 'production';

Vue.use(Vuex);

request.auth.storageKey = 'LMS_TOKEN';
request.auth.on('token:remove', () => {
  window.localStorage.removeItem('LMS_USER');
  window.location.replace(window.location.origin);
});

export default new Vuex.Store({
  modules: {
    auth,
    contentRepo,
    programs
  },
  plugins: [authPlugin({ storageKey: 'LMS_USER' })],
  strict: !isProduction
});
