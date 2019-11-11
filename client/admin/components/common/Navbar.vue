<template>
  <v-app-bar color="amber" app fixed clipped-left>
    <v-app-bar-nav-icon @click.native="$emit('update:drawer', !drawer)"/>
    <span class="title ml-3 mr-5">
      <v-icon class="mr-2">mdi-shopping</v-icon>
      Boutique
      <span class="font-weight-light">LMS</span>
    </span>
    <v-spacer />
    <v-menu min-width="220px" transition="slide-y-transition" offset-y>
      <template v-slot:activator="{ on: menu }">
        <v-tooltip left>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn icon large class="mr-2">
              <v-avatar v-on="{ ...tooltip, ...menu }" size="42px" color="#eaeaea">
                <span class="grey--text headline">{{ user.firstName[0] }}</span>
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
    fullName() {
      const { firstName, lastName } = this.user;
      return `${firstName} ${lastName}`;
    }
  },
  methods: mapActions('auth', ['logout'])
};
</script>
