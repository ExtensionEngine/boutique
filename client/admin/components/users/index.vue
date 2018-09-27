<template>
  <v-layout justify-center>
    <v-flex>
      <div class="mt-5">
        <v-toolbar color="f5f5f5" flat>
          <v-spacer/>
          <v-btn @click.stop="showDialog()" color="success" outline>Add user</v-btn>
        </v-toolbar>
        <div class="elevation-1 ml-2 mr-4">
          <v-data-table :headers="headers" :items="users" hide-actions>
            <template slot="items" slot-scope="props">
              <td>{{ props.item.email }}</td>
              <td>{{ props.item.role }}</td>
              <td>{{ props.item.firstName }}</td>
              <td>{{ props.item.lastName }}</td>
              <td>
                <v-icon @click="showDialog(props.item)" small>edit</v-icon>
              </td>
            </template>
          </v-data-table>
        </div>
        <user-modal :visible.sync="dialogVisible" :userData="editedUser"/>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import UserModal from './UserModal';
import values from 'lodash/values';

export default {
  name: 'user-list',
  data() {
    return {
      dialogVisible: false,
      editedUser: null
    };
  },
  computed: {
    ...mapState('users', ['items']),
    users() {
      return values(this.items);
    },
    headers: () => ([
      { text: 'Email', value: 'email', align: 'left' },
      { text: 'Role', value: 'role' },
      { text: 'First Name', value: 'firstName' },
      { text: 'Last Name', value: 'lastName' },
      { text: 'Actions', value: 'email', sortable: false }
    ])
  },
  methods: {
    ...mapActions('users', ['fetch']),
    showDialog(user = null) {
      this.editedUser = user;
      this.dialogVisible = true;
    }
  },
  mounted() {
    this.fetch();
  },
  components: { UserModal }
};
</script>
