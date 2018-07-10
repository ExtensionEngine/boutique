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
          <div class="dropdown is-active" @click="updateDropdown">
            <div class="dropdown-trigger">
              <button class="button dropdown-header" aria-haspopup="true" aria-controls="dropdown-menu">
                <span>{{ user.email }}</span>
                <span class="icon is-small">
                  <i class="mdi mdi-18px" :class="dropdownChevronClass" aria-hidden="true"></i>
                </span>
              </button>
            </div>
            <div class="dropdown-menu" id="dropdown-menu" role="menu" v-show="showDropdownMenu">
              <div class="dropdown-content">
                <div class="dropdown-item">
                  <router-link to="/profile">
                    <div>
                      <span class="icon is-small">
                        <i class="mdi mdi-18px mdi-account-outline" aria-hidden="true"></i>
                      </span>
                      Profile Settings
                    </div>
                  </router-link>
                </div>
                <div class="dropdown-item">
                  <a href="#" class="dropdown-item" @click="logout">
                    Logout
                  </a>
                </div>
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

const MENU_CHEVRON_SHOW = 'mdi-chevron-down';
const MENU_CHEVRON_HIDE = 'mdi-chevron-up';

export default {
  name: 'lms-navbar',
  computed: mapState('auth', ['user']),
  data() {
    return {
      showDropdownMenu: false,
      dropdownChevronClass: MENU_CHEVRON_SHOW
    };
  },
  methods: {
    ...mapActions('auth', ['logout']),
    updateDropdown() {
      this.showDropdownMenu = !this.showDropdownMenu;
      this.dropdownChevronClass = this.dropdownChevronClass ===
        MENU_CHEVRON_SHOW ? MENU_CHEVRON_HIDE : MENU_CHEVRON_SHOW;
    }
  },
  mounted() {
    // NOTE: Add appropriate css class to <html> element according to:
    //       https://bulma.io/documentation/components/navbar/#fixed-navbar
    document.documentElement.classList.add('has-navbar-fixed-top');
  }
};
</script>

<style scoped>
.dropdown-menu {
  cursor: pointer;
}
.dropdown-header {
  color: #3273dc;
  font-weight: 500;
}
.dropdown-item a {
  color: black;
}
.dropdown-item:hover {
  background-color: cornflowerblue;
}
</style>
