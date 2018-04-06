<template>
  <nav
    class="navbar is-fixed-top is-light"
    role="navigation"
    aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/admin/#/">LMS ADMIN</a>
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
  name: 'Navbar',
  computed: mapState('auth', ['user']),
  methods: mapActions('auth', ['logout'])
};
</script>
