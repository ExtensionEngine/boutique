<template>
  <nav
    class="navbar is-fixed-top is-light"
    role="navigation"
    aria-label="main navigation">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">
        <img src="~@/admin/static/assets/logo.png" class="logo" alt="New Teacher Center logo"/>
      </router-link>
    </div>
    <div class="navbar-menu">
      <div v-if="user" class="navbar-end">
        <div class="navbar-item">{{ user.email }}</div>
        <a @click="logout" href="#" class="navbar-item">Logout</a>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'lms-navbar',
  computed: mapState('auth', ['user']),
  methods: mapActions('auth', ['logout'])
};
</script>

<style lang="scss" scoped>
nav .logo {
  min-width: 10rem;
  min-height: 3rem;
}
</style>
