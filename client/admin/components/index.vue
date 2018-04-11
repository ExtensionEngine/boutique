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
