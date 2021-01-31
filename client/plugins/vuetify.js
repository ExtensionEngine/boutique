import 'vuetify/dist/vuetify.min.css';
import colors from 'vuetify/es5/util/colors';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

export default new Vuetify({
  iconfont: 'mdi',
  theme: {
    themes: {
      light: {
        primary: colors.blueGrey.darken4,
        secondary: colors.amber
      }
    }
  }
});
