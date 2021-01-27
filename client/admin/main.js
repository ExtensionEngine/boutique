import '@/common/validation';

import { ValidationObserver, ValidationProvider } from 'vee-validate';
import App from './App';
import format from 'date-fns/format';
import router from './router';
import store from './store';
import Vue from 'vue';
import VueHotkey from 'v-hotkey';
import vuetify from '@/plugins/vuetify';
import VueTimeago from 'vue-timeago';
import VueVisible from 'vue-visible';

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
Vue.use(VueHotkey);
Vue.use(VueTimeago, { name: 'vTimeago' });
Vue.use(VueVisible);

Vue.filter('formatDate', (value, dateFormat = 'MM/dd/yy HH:mm') => {
  return value && format(new Date(value), dateFormat);
});

// eslint-disable-next-line no-new
new Vue({
  store,
  router,
  vuetify,
  el: '#app',
  render: h => h(App)
});
