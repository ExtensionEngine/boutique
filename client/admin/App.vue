<template>
  <div id="app">
    <navbar/>
    <div class="container">
      <div class="columns">
        <div class="column is-3">
          <sidebar/>
        </div>
        <div class="column is-9">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

export default {
  name: 'app',
  computed: mapState('auth', ['user']),
  components: {
    Navbar,
    Sidebar
  }
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
  overflow: hidden;

  .container {
    margin-top: 80px;
  }
}
</style>
