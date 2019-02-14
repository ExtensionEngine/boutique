<template>
  <div v-router-cloak class="system-font-stack">
    <router-view/>
  </div>
</template>

<script>
import { RouterCloak } from '@/common/navigation';

export default {
  name: 'app',
  directives: { RouterCloak }
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

[v-router-cloak] {
  display: none !important;
}
</style>
