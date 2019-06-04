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
        <v-layout column align-end class="px-4 table-toolbar">
          <v-flex lg4>
            <v-text-field
              v-model="filter"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              clearable/>
          </v-flex>
          <v-flex lg4 class="my-1">
            <v-checkbox
              v-model="showArchived"
              label="Show archived"
              class="archived-checkbox"
              hide-details/>
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
            <tr :key="props.item.id">
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
                  @click="archiveOrRestore(props.item)"
                  :class="{ 'red--text': props.item.deletedAt }"
                  small
                  class="ml-2">
                  mdi-account-{{ props.item.deletedAt ? 'convert' : 'off' }}
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
        @update:visible="confirmation = null"
        @confirmed="fetch()"
        v-bind="confirmation"
        :visible="!!confirmation"/>
    </v-flex>
  </v-layout>
</template>

<script>
import api from '@/admin/api/user';
import BulkEnrollmentDialog from './BulkEnrollmentDialog';
import ConfirmationDialog from '../common/ConfirmationDialog';
import humanize from 'humanize-string';
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
const actions = user => ({
  archive: () => api.remove(user),
  restore: () => api.create(user)
});

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
      showArchived: false,
      confirmation: null
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
        archived: this.showArchived
      });
      this.users = items;
      this.totalItems = total;
    }, 400),
    archiveOrRestore(user) {
      const action = user.deletedAt ? 'restore' : 'archive';
      const name = user.firstName + ' ' + user.lastName;
      this.confirmation = {
        heading: `${humanize(action)} user`,
        message: `Are you sure you want to ${action} user "${name}"?`,
        action: actions(user)[action]
      };
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

.archived-checkbox /deep/ .v-input__slot {
  flex-direction: row-reverse;

  .v-input--selection-controls__input {
    justify-content: center;
    margin-right: 0;
  }

  .v-icon {
    font-size: 18px;
  }

  label {
    font-size: 14px;
  }
}
</style>
