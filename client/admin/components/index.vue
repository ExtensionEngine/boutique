<template>
  <v-app>
    <sidebar :drawer="drawer"/>
    <navbar :drawer.sync="drawer"/>
    <v-content>
      <v-container fluid fill-height class="grey lighten-4">
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';
import Navbar from '@/admin/components/common/Navbar';
import Sidebar from '@/admin/components/common/Sidebar';

export default {
  name: 'admin',
  data() {
    return { drawer: true };
  },
  methods: mapActions('cohorts', ['fetch']),
  created() {
    this.fetch();
  },
  components: { Navbar, Sidebar }
};
</script>
