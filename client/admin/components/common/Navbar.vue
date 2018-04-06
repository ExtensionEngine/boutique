<template>
  <nav class="navbar is-fixed-top is-light" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="https://bulma.io">
        <img src="https://bulma.io/images/bulma-logo.png" alt="LMS Starter App" width="112" height="28">
      </a>
    </div>
    <div class="navbar-menu">
      <div v-if="user" class="navbar-end">
        <div class="navbar-item">{{user.email}}</div>
        <a href="#" @click="logout" class="navbar-item">Logout</a>
      </div>
    </div>
  </nav>
</template>

<script>
  import { mapState, mapActions } from 'vuex';

  export default {
    name: 'Navbar',
    computed: {
      ...mapState('auth', ['user'])
    },
    methods: {
      ...mapActions('auth', ['logout'])
    }
  };
</script>
