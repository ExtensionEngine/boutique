import colors from 'vuetify/es5/util/colors';
import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  iconfont: 'mdiSvg',
  theme: {
    themes: {
      light: {
        primary: colors.blueGrey.darken4,
        secondary: colors.amber
      }
    }
  }
});
