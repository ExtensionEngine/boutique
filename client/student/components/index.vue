<template>
  <div class="app-container">
    <header class="app-header">
      <navbar>LMS STUDENT</navbar>
    </header>
    <main class="app-content container">
      <div class="columns">
        <div class="column is-12">
          <router-view></router-view>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Navbar from '@/common/components/Navbar';

export default {
  name: 'admin',
  components: { Navbar }
};
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  height: 100%;
  padding: 32px 0;
  flex-direction: column;
}

.app-content {
  flex: 1;
}
</style>
