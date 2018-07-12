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
          <div class="dropdown is-active"
            v-click-outside="hideDropdownMenu"
            @click="showDropdownMenu = !showDropdownMenu">
            <div class="dropdown-trigger">
              <button
                class="button dropdown-header is-transparent"
                aria-haspopup="true"
                aria-controls="dropdown-menu">
                <span>{{ user.email }}</span>
                <span
                  class="icon is-small mdi mdi-18px"
                  aria-hidden="true"
                  :class="dropdownChevronClass"></span>
              </button>
            </div>
            <div
              id="dropdown-menu"
              class="dropdown-menu"
              role="menu"
              v-show="showDropdownMenu">
              <div class="dropdown-content">
                <router-link to="/profile" class="dropdown-item">
                  <span
                    class="icon is-small mdi mdi-18px mdi-account-outline"
                    aria-hidden="true"></span>
                  Profile Settings
                </router-link>
                <a href="#" class="dropdown-item" @click="logout">
                  <span
                    class="icon is-small mdi mdi-18px mdi-logout"
                    aria-hidden="true"></span>
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import vClickOutside from 'v-click-outside';

export default {
  name: 'lms-navbar',
  data() {
    return {
      showDropdownMenu: false
    };
  },
  computed: {
    ...mapState('auth', ['user']),
    dropdownChevronClass() {
      return this.showDropdownMenu ? 'mdi-chevron-up' : 'mdi-chevron-down';
    }
  },
  methods: {
    ...mapActions('auth', ['logout']),
    hideDropdownMenu() {
      this.showDropdownMenu = false;
    }
  },
  mounted() {
    // NOTE: Add appropriate css class to <html> element according to:
    //       https://bulma.io/documentation/components/navbar/#fixed-navbar
    document.documentElement.classList.add('has-navbar-fixed-top');
  },
  directives: {
    clickOutside: vClickOutside.directive
  }
};
</script>

<style lang="scss" scoped>
$dropdownColor: #eee;

.dropdown {
  &-menu {
    cursor: pointer;
  }
  &-header {
    color: #3273dc;
    font-weight: 500;
  }
  &-content {
    background: $dropdownColor;
  }
  &-item:hover {
    color: #fff;
    background: rgba(57, 127, 247, 0.7);
  }
}
.is-transparent {
  background: transparent;
  background-image: none;
}
</style>
