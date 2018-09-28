<template>
  <div id="app" class="system-font-stack">
    <navbar/>
    <router-view/>
  </div>
</template>

<script>
import Navbar from '@/student/components/common/Navbar';

export default {
  name: 'app',
  components: { Navbar }
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
  background-color: #e5e5e5;
}

#app {
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
}
</style>
