<template>
  <v-app-bar color="primary" app dark>
    <v-toolbar-title>
      <router-link :to="rootRoute" class="d-flex align-center">
        <v-icon size="24" class="mr-1">{{ mdiShopping }}</v-icon>
        <span class="white--text">Boutique</span>
      </router-link>
    </v-toolbar-title>
    <v-spacer />
    <v-text-field
      v-if="$route.name === 'courseware' && courseware.length"
      @input="setCoursewareFilter"
      :value="coursewareFilter"
      :prepend-inner-icon="mdiMagnify"
      placeholder="Search..."
      hide-details clearable filled dense />
    <v-spacer />
    <v-menu>
      <template #activator="{ on }">
        <div v-on="on" class="dropdown-activator">
          <v-icon size="24" class="mr-1">{{ mdiAccountCircle }}</v-icon>
          <span>{{ user.email }}</span>
          <v-icon size="24" class="mr-1">{{ mdiChevronDown }}</v-icon>
        </div>
      </template>
      <v-list>
        <v-list-item @click.prevent="logout">
          <v-list-item-title>
            <v-icon size="24" class="mr-1">{{ mdiLogout }}</v-icon>
            <span>Logout</span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import { mdiAccountCircle, mdiChevronDown, mdiLogout, mdiMagnify, mdiShopping } from '@mdi/js';

export default {
  name: 'main-navbar',
  data: () => ({
    mdiAccountCircle,
    mdiChevronDown,
    mdiLogout,
    mdiMagnify,
    mdiShopping
  }),
  computed: {
    ...mapState('auth', ['user']),
    ...mapState('learner', ['coursewareFilter']),
    ...mapGetters('learner', ['courseware']),
    programId: vm => vm.$route.params.programId,
    rootRoute() {
      const { programId } = this;
      return programId
        ? { name: 'courseware', params: { programId } }
        : { name: 'program-selection' };
    }
  },
  methods: {
    ...mapActions('auth', ['logout']),
    ...mapMutations('learner', ['setCoursewareFilter'])
  }
};
</script>

<style lang="scss" scoped>
.dropdown-activator {
  cursor: pointer;
}
</style>
