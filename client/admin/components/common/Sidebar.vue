<template>
  <div class="main-drawer">
    <v-navigation-drawer
      @input="val => $emit('update:drawer', val)"
      :value="drawer"
      fixed
      clipped
      app
      class="grey lighten-4">
      <v-list flat dense class="grey lighten-4 pt-4">
        <v-list-item
          v-for="({ name, route, icon }) in sidebarLinks"
          :key="name"
          :to="{ name: route }"
          exact>
          <v-list-item-action><v-icon>{{ icon }}</v-icon></v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="grey--text">{{ name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider dark class="my-3" />
        <v-row align="center" no-gutters>
          <v-col cols="6">
            <v-subheader class="subtitle-2 ml-2">Programs</v-subheader>
          </v-col>
          <v-col cols="6" class="text-right">
            <program-modal />
          </v-col>
        </v-row>
        <v-list-item
          v-for="program in persistedPrograms"
          :key="program.id"
          :to="{ name: 'enrollments', params: { programId: program.id } }"
          active-class="grey lighten-2">
          <v-list-item-content>
            <v-list-item-title class="grey--text">
              {{ program.name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import filter from 'lodash/filter';
import { mapState } from 'vuex';
import ProgramModal from '../Program/CreateDialog';

export default {
  props: {
    drawer: { type: Boolean, default: true }
  },
  data() {
    return {
      sidebarLinks: [
        { name: 'Users', route: 'users', icon: 'mdi-contacts' },
        { name: 'Groups', route: 'groups', icon: 'mdi-account-multiple' }
      ]
    };
  },
  computed: {
    ...mapState('programs', { programs: 'items' }),
    persistedPrograms() {
      return filter(this.programs, 'id');
    }
  },
  components: { ProgramModal }
};
</script>

<style lang="scss">
.main-drawer .v-navigation-drawer__border {
  display: none;
}
</style>
