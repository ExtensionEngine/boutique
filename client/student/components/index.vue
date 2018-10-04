<template>
  <div>
    <navbar/>
    <div class="container">
      <router-view/>
    </div>
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
.container {
  display: flex;
  padding: 50px 0;
  flex-direction: column;
}
</style>
