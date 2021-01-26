<template>
  <v-app-bar
    color="primary"
    elevation="2"
    app fixed clipped-left dark>
    <v-app-bar-nav-icon @click.native="$emit('update:drawer', !drawer)" />
    <v-toolbar-title>
      <v-icon dense class="mr-1">mdi-school</v-icon>
      Tailor
      <span class="pa-1">|</span>
      <span class="subtitle-1 secondary--text">LMS starter</span>
    </v-toolbar-title>
    <v-spacer />
    <v-menu min-width="220px" transition="slide-y-transition" offset-y>
      <template v-slot:activator="{ on: menu }">
        <v-tooltip left>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn icon large class="mr-2">
              <v-avatar
                v-on="{ ...tooltip, ...menu }"
                size="36"
                color="primary lighten-2">
                {{ user.firstName[0] }}
              </v-avatar>
            </v-btn>
          </template>
          <span>{{ fullName }}</span>
        </v-tooltip>
      </template>
      <v-list>
        <v-list-item @click="logout">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'main-toolbar',
  props: {
    drawer: { type: Boolean, default: true }
  },
  computed: {
    ...mapState('auth', ['user']),
    fullName: ({ user }) => `${user.firstName} ${user.lastName}`
  },
  methods: mapActions('auth', ['logout'])
};
</script>
