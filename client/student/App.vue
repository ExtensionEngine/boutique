<template>
  <div id="app" class="system-font-stack">
    <img class="logo" src="./static/logo.png" alt="Logo">
    <greet message="Hello world! 😉"></greet>
  </div>
</template>

<script>
import Greet from '@/student/components/Greet';

export default {
  name: 'app',
  components: {
    Greet
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
}

.logo {
  display: block;
  width: auto;
  height: 64px;
  margin: 16px auto;
}
</style>
