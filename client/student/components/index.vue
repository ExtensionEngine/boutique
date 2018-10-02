<template>
  <div class="app-container">
    <header>
      <navbar/>
    </header>
    <main>
      <div class="columns">
        <div class="column is-12">
          <router-view/>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Navbar from '@/student/components/common/Navbar';

export default {
  name: 'root',
  components: { Navbar }
};
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  padding: 50px 0;
  flex-direction: column;
}
</style>
