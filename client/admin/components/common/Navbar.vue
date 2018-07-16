<template>
  <nav
    class="navbar is-fixed-top is-light"
    role="navigation"
    aria-label="main navigation">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">LMS ADMIN</router-link>
    </div>
    <div class="navbar-menu">
      <div v-if="user" class="navbar-end">
        <div class="navbar-item">
          <dropdown v-bind:userEmail="user.email"/>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex';
import Dropdown from './Dropdown';

export default {
  name: 'lms-navbar',
  components: { Dropdown },
  data() {
    return {
      showDropdownMenu: false
    };
  },
  computed: {
    ...mapState('auth', ['user'])
  },
  mounted() {
    // NOTE: Add appropriate css class to <html> element according to:
    //       https://bulma.io/documentation/components/navbar/#fixed-navbar
    document.documentElement.classList.add('has-navbar-fixed-top');
  }
};
</script>
