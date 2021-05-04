import '@/common/validation';

import {
  setInteractionMode,
  ValidationObserver,
  ValidationProvider
} from 'vee-validate';
import App from './App';
import getStore from './store';
import router from './router';
import truncate from 'truncate';
import Vue from 'vue';
import vuetify from '@/plugins/vuetify';
import VueVisible from 'vue-visible';

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
setInteractionMode('eager');

Vue.use(VueVisible);

Vue.filter('truncate', (value, maxLength = 50) => {
  return value && truncate(value, maxLength);
});

getStore()
  .then(store => {
    /* eslint-disable no-new */
    new Vue({
      router,
      store,
      vuetify,
      el: '#app',
      render: h => h(App)
    });
  });
