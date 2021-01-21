import '@/common/validation';

import { ValidationObserver, ValidationProvider } from 'vee-validate';
import App from './App';
import router from './router';
import store from './store';
import truncate from 'truncate';
import Vue from 'vue';
import vuetify from '@/plugins/vuetify';
import VueVisible from 'vue-visible';

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
Vue.use(VueVisible);

Vue.filter('truncate', (value, maxLength = 50) => {
  return value && truncate(value, maxLength);
});

// eslint-disable-next-line no-new
new Vue({
  router,
  store,
  vuetify,
  el: '#app',
  render: h => h(App)
});
