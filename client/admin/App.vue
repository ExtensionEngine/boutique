<template>
  <v-app id="app">
    <sidebar :drawer="drawer"/>
    <navbar :drawer.sync="drawer"/>
    <v-content>
      <v-container fluid fill-height class="grey lighten-4">
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';
import Navbar from '@/admin/components/common/Navbar';
import Sidebar from '@/admin/components/common/Sidebar';

export default {
  name: 'admin-app',
  data() {
    return { drawer: true };
  },
  methods: mapActions('cohorts', ['fetch']),
  created() {
    this.fetch();
  },
  components: { Navbar, Sidebar }
};
</script>

<style lang="scss">
@import "./stylesheets/main";

* {
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
