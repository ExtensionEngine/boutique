<template>
  <div>
    <navbar/>
    <div class="container">
      <div class="columns">
        <div class="column is-2">
          <sidebar/>
        </div>
        <div class="column is-10">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Navbar from '@/admin/components/common/Navbar';
import Sidebar from '@/admin/components/common/Sidebar';

export default {
  name: 'admin',
  computed: mapState('auth', ['user']),
  components: { Navbar, Sidebar }
};
</script>

<style lang="scss" scoped>
.message {
  text-align: center;
}
</style>
