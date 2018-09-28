<template>
  <div class="app-container">
    <header class="app-header">
    </header>
    <main class="app-content">
      <div class="columns">
        <div class="column is-12">
          <router-view></router-view>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'student'
};
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  height: 100%;
  padding: 32px 0;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
}

.app-content {
  flex: 1;
}
</style>
