<template>
  <div id="app" class="system-font-stack">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
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
  display: flex;
  height: 100%;
  padding: 32px 0;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
