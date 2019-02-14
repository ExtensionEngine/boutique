<template>
  <div v-router-cloak>
    <router-view/>
  </div>
</template>

<script>
import { RouterCloak } from '@/common/navigation';

export default {
  name: 'admin-app',
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
}

#app {
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

[v-router-cloak] {
  display: none;
}
</style>
