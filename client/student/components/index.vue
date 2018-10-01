<template>
  <div>
    <header class="app-header">
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
  name: 'learner-root',
  components: { Navbar }
};
</script>
