<template>
  <div class="main-drawer">
    <v-navigation-drawer
      @input="$emit('update:drawer', $event)"
      :value="drawer"
      color="primary"
      app fixed clipped
      dark expand-on-hover>
      <v-list
        flat dense shaped
        class="pt-4 fill-height">
        <v-list-item
          v-for="it in routes"
          :key="it.to"
          :to="{ name: it.to }"
          class="mb-1">
          <v-list-item-icon>
            <v-icon>mdi-{{ it.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ it.label }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  props: {
    drawer: { type: Boolean, default: true }
  },
  computed: {
    routes: vm => [
      { label: 'Users', icon: 'account-multiple', to: 'users' },
      { label: 'Programs', icon: 'bookshelf', to: 'programs' }
    ]
  }
};
</script>

<style lang="scss">
.main-drawer .v-navigation-drawer__border {
  display: none;
}
</style>
