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
          :key="it.name"
          :to="{ name: it.name }"
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
    routes: () => [
      { name: 'users', label: 'Users', icon: 'account-multiple' },
      { name: 'user-groups', label: 'User Groups', icon: 'account-group' },
      { name: 'programs', label: 'Programs', icon: 'bookshelf' }
    ]
  }
};
</script>

<style lang="scss">
.main-drawer .v-navigation-drawer__border {
  display: none;
}
</style>
