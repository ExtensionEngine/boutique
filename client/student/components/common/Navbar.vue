<template>
  <nav
    class="navbar is-fixed-top is-info"
    role="navigation"
    aria-label="main navigation">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">
        LMS STUDENT
      </router-link>
    </div>
    <div class="navbar-menu">
      <div v-if="user" class="navbar-end">
        <router-link
          v-if="selectedProgramId"
          to="/courseware"
          class="navbar-item">
          Dashboard
        </router-link>
        <div class="navbar-item">{{ user.email }}</div>
        <a @click="logout" href="#" class="navbar-item">Logout</a>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'lms-navbar',
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
