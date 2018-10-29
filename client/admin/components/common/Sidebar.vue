<template>
  <div class="main-drawer">
    <v-navigation-drawer
      :value="drawer"
      @input="val => $emit('update:drawer', val)"
      fixed
      clipped
      app
      class="grey lighten-4">
      <v-list dense class="grey lighten-4 pt-4">
        <v-list-tile :to="{ name: 'users' }">
          <v-list-tile-action><v-icon>mdi-contacts</v-icon></v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="grey--text">Users</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider dark class="my-3"/>
        <v-layout row align-center>
          <v-flex xs6>
            <v-subheader>Programs</v-subheader>
          </v-flex>
          <v-flex xs6 class="text-xs-right">
            <program-modal/>
          </v-flex>
        </v-layout>
        <v-list-tile
          v-for="program in programs"
          :key="program._cid"
          :to="{ name: 'enrollments', params: { programId: program.id } }">
          <v-list-tile-content>
            <v-list-tile-title class="grey--text">
              {{ program.name }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ProgramModal from '../Program/CreateDialog';

export default {
  props: {
    drawer: { type: Boolean, default: true }
  },
  computed: mapState('programs', { programs: 'items' }),
  components: { ProgramModal }
};
</script>

<style lang="scss">
.main-drawer .v-navigation-drawer__border {
  display: none;
}
</style>
