<template>
  <div>
    <h1 class="title">Users Overview</h1>
    <button @click="showModal = true" class="button is-primary">Create</button>
    <table class="table is-fullwidth is-hoverable">
      <thead>
        <th>Email</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Role</th>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.email }}</td>
          <td>{{ user.firstName }}</td>
          <td>{{ user.lastName }}</td>
          <td>{{ user.role }}</td>
        </tr>
      </tbody>
    </table>
    <user-modal
      :show="showModal"
      @close="showModal = false">
    </user-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import UserModal from './UserModal';

export default {
  name: 'user-list',
  data() {
    return {
      showModal: false
    };
  },
  computed: mapState('users', { users: 'items' }),
  methods: mapActions('users', ['fetch']),
  mounted() {
    this.fetch();
  },
  components: { UserModal }
};
</script>
