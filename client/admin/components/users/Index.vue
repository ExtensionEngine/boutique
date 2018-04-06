<template>
  <div>
    <h1 class="title">
      Users Overview
    </h1>

    <table class="table is-fullwidth is-hoverable">
      <thead>
        <th>Email</th>
        <th>First Name</th>
        <th>Last Name</th>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user && user.id">
          <td>{{ user && user.email }}</td>
          <td>{{ user && user.firstName }}</td>
          <td>{{ user && user.lastName }}</td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<script>
  import { mapState, mapActions } from 'vuex';

  export default {
    name: 'usersIndex',
    computed: {
      ...mapState('users', ['users'])
    },
    methods: {
      ...mapActions('users', ['getUsers'])
    },
    mounted() {
      this.getUsers();
    }
  };
</script>
