<template>
  <div class="main-drawer">
    <v-navigation-drawer
      v-model="drawer"
      fixed
      clipped
      app
      class="grey lighten-4">
      <v-list dense class="grey lighten-4 pt-4">
        <v-list-tile :to="{ name: 'users' }">
          <v-list-tile-action><v-icon>contacts</v-icon></v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="grey--text">Users</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider dark class="my-3"/>
        <v-layout row align-center>
          <v-flex xs6>
            <v-subheader>Cohorts</v-subheader>
          </v-flex>
          <v-flex xs6 class="text-xs-right">
            <cohort-modal/>
          </v-flex>
        </v-layout>
        <v-list-tile
          v-for="cohort in cohorts"
          :key="cohort._cid"
          :to="{ name: 'enrollments', params: { cohortId: cohort.id } }">
          <v-list-tile-content>
            <v-list-tile-title class="grey--text">
              {{ cohort.name }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import CohortModal from '../cohorts/CohortModal';
import { mapState } from 'vuex';

export default {
  props: {
    drawer: { type: Boolean, default: true }
  },
  computed: mapState('cohorts', { cohorts: 'items' }),
  components: { CohortModal }
};
</script>

<style lang="scss">
.main-drawer .v-navigation-drawer__border {
  display: none;
}
</style>
