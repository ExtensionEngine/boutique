<template>
  <nav
    class="navbar is-fixed-top is-info"
    role="navigation"
    aria-label="main navigation">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">
        Boutique
      </router-link>
    </div>
    <div v-if="user" class="navbar-menu">
      <div class="navbar-end">
        <router-link
          v-if="selectedProgramId"
          :to="{ name: 'courseware' }"
          class="navbar-item">
          Dashboard
        </router-link>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            {{ user.email }}
          </a>
          <div class="navbar-dropdown is-right">
            <a class="navbar-item">
              <a @click="logout" href="#" class="navbar-item">Logout</a>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'main-navbar',
  computed: {
    ...mapState('auth', ['user']),
    ...mapState('learner', ['selectedProgramId'])
  },
  methods: mapActions('auth', ['logout']),
  mounted() {
    // NOTE: Add appropriate css class to <html> element according to:
    //       https://bulma.io/documentation/components/navbar/#fixed-navbar
    document.documentElement.classList.add('has-navbar-fixed-top');
  }
};
</script>
