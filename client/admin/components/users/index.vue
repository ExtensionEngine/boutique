<template>
  <div>
    <h1 class="title">Users</h1>
    <button
      @click="create"
      class="btn-create button is-primary is-pulled-right">
      Create
    </button>
    <table class="table is-fullwidth is-hoverable">
      <thead>
        <th>Email</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Role</th>
        <th></th>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user._cid">
          <td>{{ user.email }}</td>
          <td>{{ user.firstName }}</td>
          <td>{{ user.lastName }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button @click="edit(user)" class="button is-small is-pulled-right is-outlined">
              <span class="mdi mdi-pencil"></span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <user-modal
      :show="showModal"
      :userData="context"
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
      showModal: false,
      context: null
    };
  },
  computed: mapState('users', { users: 'items' }),
  methods: {
    ...mapActions('users', ['fetch']),
    create() {
      this.context = null;
      this.showModal = true;
    },
    edit(user) {
      this.context = user;
      this.showModal = true;
    }
  },
  mounted() {
    this.fetch();
  },
  components: { UserModal }
};
</script>
