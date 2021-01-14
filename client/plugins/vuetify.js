import 'vuetify/dist/vuetify.min.css';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

export default new Vuetify({
  iconfont: 'mdi',
  theme: {
    themes: {
      light: {
        warning: '#fddd57'
      }
    }
  }
});
