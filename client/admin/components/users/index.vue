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
          <v-flex lg6>
            <v-checkbox
              v-model="showArchived"
              label="Show archived users"/>
          </v-flex>
          <v-spacer/>
          <v-flex lg3>
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
            <tr :key="props.item.id" :class="{ 'archived': props.item.deletedAt }">
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
                <v-icon v-if="!props.item.deletedAt" @click="archiveUser(props.item)" small class="ml-2">
                  mdi-account-off
                </v-icon>
                <v-icon v-else @click="reactivateUser(props.item)" small class="ml-2">
                  mdi-account-convert
                </v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
      <user-dialog
        :visible.sync="userDialog"
        :userData="editedUser"
        @updated="fetch(defaultPage)"
        @created="fetch(defaultPage)"/>
      <confirmation-dialog
        :visible.sync="confirmation.dialog"
        :action="confirmation.action"
        :heading="confirmation.heading"
        :message="confirmation.message"
        @confirmed="fetch()"/>
    </v-flex>
  </v-layout>
</template>

<script>
import api from '@/admin/api/user';
import BulkEnrollmentDialog from './BulkEnrollmentDialog';
import ConfirmationDialog from '../common/ConfirmationDialog';
import ImportDialog from './ImportDialog';
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
      showArchived: null,
      confirmation: { dialog: null }
    };
  },
  computed: {
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
      const { items, total } = await api.fetch({
        ...this.dataTable,
        filter: this.filter,
        deleted: this.showArchived
      });
      this.users = items;
      this.totalItems = total;
    }, 400),
    archiveUser(user) {
      const name = user.firstName + ' ' + user.lastName;
      Object.assign(this.confirmation, {
        heading: 'Archive user',
        message: `Are you sure you want to archive user "${name}"?`,
        action: () => api.remove(user),
        dialog: true
      });
    },
    reactivateUser(user) {
      const name = user.firstName + ' ' + user.lastName;
      Object.assign(this.confirmation, {
        heading: 'Reactivate user',
        message: `Are you sure you want to reactivate user "${name}"?`,
        action: () => api.create(user),
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
    },
    showArchived() {
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

.archived {
  background: #ebebeb;
}
</style>
