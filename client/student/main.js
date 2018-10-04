import App from './App';
import router from './router';
import store from './store';
import truncate from 'truncate';
import VeeValidate from '@/common/validation';
import Vue from 'vue';
import VueVisible from 'vue-visible';

Vue.use(VeeValidate, {
  delay: 700,
  fieldsBagName: 'vFields',
  errorBagName: 'vErrors',
  inject: false
});
Vue.use(VueVisible);

Vue.filter('truncate', (value, maxLength = 50) => {
  return value && truncate(value, maxLength);
});

// eslint-disable-next-line no-new
new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
});
