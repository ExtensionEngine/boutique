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
          <dropdown>
            <span slot="header">{{ user.email }}</span>
            <div slot="menuItems">
              <router-link to="/profile">
                <span
                  class="icon is-small mdi mdi-18px mdi-account-outline">
                </span>
                Profile Settings
              </router-link>
              <a href="#" @click="logout">
                <span
                  class="icon is-small mdi mdi-18px mdi-logout">
                </span>
                Logout
              </a>              
            </div>
          </dropdown>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapState } from 'vuex';
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
  methods: {
    ...mapActions('auth', ['logout'])
  },
  mounted() {
    // NOTE: Add appropriate css class to <html> element according to:
    //       https://bulma.io/documentation/components/navbar/#fixed-navbar
    document.documentElement.classList.add('has-navbar-fixed-top');
  }
};
</script>
