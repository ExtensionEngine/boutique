import auth from '@/common/store/modules/auth';
import { auth as authPlugin } from '@/common/store/plugins';
import learner from '@/student/store/modules/learner';
import request from '@/common/api/request';
import Vue from 'vue';
import Vuex from 'vuex';

const isProduction = process.env.NODE_ENV === 'production';

Vue.use(Vuex);

request.auth.storageKey = 'LMS_TOKEN';
request.auth.on('token:remove', () => {
  window.localStorage.removeItem('LMS_USER');
});

export default new Vuex.Store({
  modules: {
    auth,
    learner
  },
  plugins: [authPlugin({ storageKey: 'LMS_USER' })],
  strict: !isProduction
});
