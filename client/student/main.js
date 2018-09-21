import App from './App';
import router from './router';
import store from './store';
import Vue from 'vue';

// eslint-disable-next-line no-new
new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
});
