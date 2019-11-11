<template>
  <router-host>
    <div id="app" class="system-font-stack">
      <router-view />
    </div>
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
  background-color: #f5f5f5;
  overflow: hidden;
}

#app {
  height: 100%;
  overflow-y: scroll;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
