import App from './App';
import Croppa from 'vue-croppa';
import router from './router';
import store from './store';
import Snotify from 'vue-snotify';
import VeeValidate from '@/common/validation';
import Vue from 'vue';
import VueHotkey from 'v-hotkey';
import VueVisible from 'vue-visible';

Vue.use(Croppa);
Vue.use(Snotify);
Vue.use(VeeValidate, {
  delay: 700,
  fieldsBagName: 'vFields',
  errorBagName: 'vErrors',
  inject: false
});
Vue.use(VueHotkey);
Vue.use(VueVisible);

// eslint-disable-next-line no-new
new Vue({
  store,
  router,
  el: '#app',
  render: h => h(App)
});
