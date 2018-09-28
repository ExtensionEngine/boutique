<template>
  <div id="app" class="system-font-stack">
    <header class="app-header">
      <navbar/>
    </header>
    <main>
      <div class="columns">
        <div class="column is-12">
          <router-view></router-view>
        </div>
      </div>
    </main>
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
