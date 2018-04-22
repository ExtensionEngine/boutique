<template>
  <div class="app-container">
    <header class="app-header">
      <navbar/>
    </header>
    <main class="app-content container">
      <div class="columns">
        <div class="column is-2">
          <sidebar/>
        </div>
        <div class="column is-10">
          <router-view></router-view>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Navbar from '@/admin/components/common/Navbar';
import Sidebar from '@/admin/components/common/Sidebar';

export default {
  name: 'admin',
  components: { Navbar, Sidebar },
  methods: mapActions('programs', ['fetch']),
  created() {
    this.fetch();
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  height: 100%;
  padding: 32px 0;
  display: flex;
  flex-direction: column;
}

.app-content {
  flex: 1;
}
</style>
