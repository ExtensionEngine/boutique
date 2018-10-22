<template>
  <nav
    class="navbar is-fixed-top is-info"
    role="navigation"
    aria-label="main navigation">
    <div class="navbar-brand">
      <router-link :to="rootRoute" class="navbar-item">
        <span class="mdi mdi-shopping"></span>Boutique
      </router-link>
    </div>
    <div v-if="user" class="navbar-menu">
      <transition name="fade">
        <div
          v-show="$route.name === 'courseware' && courseware.length"
          class="navbar-start search-container">
          <div class="navbar-item">
            <search/>
          </div>
        </div>
      </transition>
      <div class="navbar-end">
        <div class="navbar-item has-dropdown is-hoverable user-dropdown">
          <a href="#" class="navbar-link">
            <span class="mdi mdi-account-circle"></span>{{ user.email }}
          </a>
          <div class="navbar-dropdown is-right">
            <a @click.prevent="logout" href="#" class="navbar-item">
              <span class="mdi mdi-logout"></span>Logout
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import Search from './Search';

export default {
  name: 'main-navbar',
  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('learner', ['courseware']),
    programId() {
      return this.$route.params.programId;
    },
    rootRoute() {
      const { programId } = this;
      return programId
        ? { name: 'courseware', params: { programId } }
        : { name: 'program-selection' };
    }
  },
  methods: mapActions('auth', ['logout']),
  mounted() {
    // NOTE: Add appropriate css class to <html> element according to:
    //       https://bulma.io/documentation/components/navbar/#fixed-navbar
    document.documentElement.classList.add('has-navbar-fixed-top');
  },
  components: { Search }
};
</script>

<style lang="scss" scoped>
.navbar {
  min-height: 4rem;
  box-shadow:
    0 2px 4px -1px rgba(0,0,0,0.2),
    0 4px 5px 0 rgba(0,0,0,0.14),
    0 1px 10px 0 rgba(0,0,0,0.12);
}

.navbar-item {
  font-size: 1.25rem;
  font-weight: 300;
}

.search-container {
  width: 51%;
  margin-left: 6%;
}

.search-container .navbar-item {
  width: 100%;
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.user-dropdown {
  margin-left: 2rem;

  .navbar-dropdown {
    padding: 0;
  }

  .mdi {
    padding-right: 0.5rem;
    font-size: 1.5rem;
  }

  .navbar-link .mdi {
    font-size: 2rem;
  }

  .mdi-logout {
    padding-left: 0.4rem;
  }

  .navbar-item {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }
}

.navbar-brand .navbar-item {
  padding: 0 1.5rem;
  font-size: 1.5rem;
  line-height: 2.5rem;

  .mdi {
    margin-right: 0.5rem;
    font-size: 2rem;
  }
}
</style>
