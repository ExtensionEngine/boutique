<template>
  <div class="dropdown is-active"
    v-click-outside="hideDropdownMenu"
    @click="showDropdownMenu = !showDropdownMenu">
    <div class="dropdown-trigger">
      <button
        class="button dropdown-header is-transparent"
        aria-haspopup="true"
        aria-controls="dropdown-menu">
          <span>{{ userEmail }}</span>
          <span
            class="icon is-small mdi mdi-18px"
            aria-hidden="true"
            :class="dropdownChevronClass">
          </span>
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
            aria-hidden="true">
          </span>
          Profile Settings
        </router-link>
        <a href="#" class="dropdown-item" @click="logout">
          <span
            class="icon is-small mdi mdi-18px mdi-logout"
            aria-hidden="true">
          </span>
          Logout
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import vClickOutside from 'v-click-outside';

export default {
  data() {
    return {
      showDropdownMenu: false
    };
  },
  props: {
    userEmail: String
  },
  computed: {
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
    color: #0ccce8;
    font-weight: 500;
  }

  &-content {
    background: $dropdownColor;
  }

  &-item:hover {
    color: #fff;
    font-weight: bold;
    background: rgba(50, 110, 130, 0.3);
  }
}

.is-transparent {
  background: transparent;
  background-image: none;
}
</style>
