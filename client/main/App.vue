<template>
  <router-host>
    <v-app id="app">
      <v-content>
        <v-container fluid fill-height class="grey lighten-4">
          <router-view />
        </v-container>
      </v-content>
    </v-app>
  </router-host>
</template>

<script>
import RouterHost from '@/common/components/RouterHost';

export default {
  name: 'app',
  components: { RouterHost }
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
  overflow: hidden;
}

#app {
  height: 100%;
  overflow-y: scroll;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.v-content {
  background-color: #f5f5f5;
}
</style>
