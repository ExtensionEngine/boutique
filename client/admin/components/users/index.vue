<template>
  <v-layout justify-center>
    <v-flex class="mt-5">
      <v-toolbar color="#f5f5f5" flat>
        <v-spacer/>
        <import-dialog @imported="fetch(defaultPage)"/>
        <bulk-enrollment-dialog :disabled="!selectedUsers.length" :users="selectedUsers"/>
        <v-btn @click.stop="showUserDialog()" color="success" outline>
          Add user
        </v-btn>
      </v-toolbar>
      <div class="elevation-1 ml-2 mr-4">
        <v-layout class="px-4 py-3 table-toolbar">
          <v-flex lg3 offset-lg9>
            <v-text-field
              v-model="filter"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              clearable/>
          </v-flex>
        </v-layout>
        <v-data-table
          v-model="selectedUsers"
          :headers="headers"
          :items="users"
          :total-items="totalItems"
          :pagination.sync="dataTable"
          :must-sort="true"
          class="user-table"
          select-all>
          <template slot="items" slot-scope="props">
            <tr>
              <td>
                <v-checkbox v-model="props.selected" primary hide-details/>
              </td>
              <td>{{ props.item.email }}</td>
              <td>{{ props.item.role }}</td>
              <td>{{ props.item.firstName }}</td>
              <td>{{ props.item.lastName }}</td>
              <td class="no-wrap">{{ props.item.createdAt | formatDate }}</td>
              <td class="no-wrap text-xs-center">
                <v-icon @click="showUserDialog(props.item)" small>
                  mdi-pencil
                </v-icon>
                <v-icon
                  @click="removeUser(props.item)"
                  :disabled="user.id != props.item.id"
                  small
                  class="ml-2">
                  mdi-delete
                </v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
      <user-dialog
        @updated="fetch(defaultPage)"
        @created="fetch(defaultPage)"
        :visible.sync="userDialog"
        :userData="editedUser"/>
      <confirmation-dialog
        @confirmed="fetch()"
        :visible.sync="confirmation.dialog"
        :action="confirmation.action"
        :message="confirmation.message"
        heading="Remove user"/>
    </v-flex>
  </v-layout>
</template>

<script>
import api from '@/admin/api/user';
import BulkEnrollmentDialog from './BulkEnrollmentDialog';
import ConfirmationDialog from '../common/ConfirmationDialog';
import ImportDialog from './ImportDialog';
import { mapState } from 'vuex';
import throttle from 'lodash/throttle';
import UserDialog from './UserDialog';

const defaultPage = () => ({ sortBy: 'updatedAt', descending: true, page: 1 });
const headers = () => [
  { text: 'Email', value: 'email' },
  { text: 'Role', value: 'role' },
  { text: 'First Name', value: 'firstName' },
  { text: 'Last Name', value: 'lastName' },
  { text: 'Date Created', value: 'createdAt' },
  { text: 'Actions', value: 'email', align: 'center', sortable: false }
];

export default {
  name: 'user-list',
  data() {
    return {
      users: [],
      selectedUsers: [],
      filter: null,
      dataTable: defaultPage(),
      totalItems: 0,
      userDialog: false,
      editedUser: null,
      confirmation: { dialog: null }
    };
  },
  computed: {
    ...mapState('auth', ['user']),
    headers,
    defaultPage
  },
  methods: {
    showUserDialog(user = null) {
      this.editedUser = user;
      this.userDialog = true;
    },
    fetch: throttle(async function (opts) {
      Object.assign(this.dataTable, opts);
      const params = { ...this.dataTable, filter: this.filter };
      const { items, total } = await api.fetch(params);
      this.users = items;
      this.totalItems = total;
    }, 400),
    removeUser(user) {
      const name = user.firstName + ' ' + user.lastName;
      Object.assign(this.confirmation, {
        message: `Are you sure you want to remove user "${name}"?`,
        action: () => api.remove(user),
        dialog: true
      });
    }
  },
  watch: {
    dataTable() {
      this.fetch();
    },
    filter() {
      this.fetch();
    }
  },
  components: { BulkEnrollmentDialog, ConfirmationDialog, ImportDialog, UserDialog }
};
</script>

<style lang="scss" scoped>
.user-table /deep/ .v-input--checkbox {
  justify-content: center;
}
</style>
