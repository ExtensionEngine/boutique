<template>
  <v-layout justify-center>
    <v-flex class="mt-5">
      <v-toolbar color="#f5f5f5" flat>
        <v-spacer/>
        <bulk-enrollment-dialog
          :enrollDisabled="disableEnroll"
          :users="checkedItems"/>
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
          v-model="checkedItems"
          :headers="headers"
          :items="users"
          :total-items="totalItems"
          :pagination.sync="dataTable"
          select-all
          item-key="id"
          class="elevation-1">
          <template slot="items" slot-scope="props">
            <tr>
              <td class="text-xs-center">
                <v-checkbox
                  v-model="props.selected"
                  primary
                  hide-details
                ></v-checkbox>
              </td>
              <td class="text-xs-left">{{ props.item.email }}</td>
              <td class="text-xs-left">{{ props.item.role }}</td>
              <td class="text-xs-left">{{ props.item.firstName }}</td>
              <td class="text-xs-left">{{ props.item.lastName }}</td>
              <td class="text-xs-left">{{ props.item.createdAt | formatDate }}</td>
              <td class="text-xs-center">
                <v-icon @click="showUserDialog(props.item)" small>mdi-pencil</v-icon>
                <v-icon @click="removeUser(props.item)" small class="ml-3">mdi-delete</v-icon>
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
        :visible.sync="confirmationDialog"
        :action="confirmationAction"
        @confirmed="fetch()"
        heading="Remove user"
        message="Are you sure you want to remove user?"/>
    </v-flex>
  </v-layout>
</template>

<script>
import api from '@/admin/api/user';
import BulkEnrollmentDialog from './BulkEnrollmentDialog';
import ConfirmationDialog from '../common/ConfirmationDialog';
import throttle from 'lodash/throttle';
import UserDialog from './UserDialog';

const defaultPage = () => ({ sortBy: 'updatedAt', descending: true, page: 1 });

export default {
  name: 'user-list',
  data() {
    return {
      headers: [
        { text: 'Email', value: 'email', align: 'left' },
        { text: 'Role', value: 'role', align: 'left' },
        { text: 'First Name', value: 'firstName', align: 'left' },
        { text: 'Last Name', value: 'lastName', align: 'left' },
        { text: 'Date Created', value: 'createdAt', align: 'left' },
        { text: 'Actions', value: 'email', align: 'center', sortable: false }
      ],
      users: [],
      filter: null,
      userDialog: false,
      editedUser: null,
      confirmationDialog: null,
      confirmationAction: null,
      dataTable: defaultPage(),
      totalItems: 0,
      isLoading: false,
      checkedItems: []
    };
  },
  computed: {
    disableEnroll() {
      return !this.checkedItems.length;
    },
    defaultPage
  },
  methods: {
    showUserDialog(user = null) {
      this.editedUser = user;
      this.userDialog = true;
    },
    fetch: throttle(async function (opts) {
      this.isLoading = true;
      Object.assign(this.dataTable, opts);
      const params = { ...this.dataTable, filter: this.filter };
      const { items, total } = await api.fetch(params);
      this.users = items;
      this.totalItems = total;
      this.isLoading = false;
    }, 400),
    removeUser(user) {
      this.confirmationAction = () => api.remove(user);
      this.confirmationDialog = true;
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
  components: { BulkEnrollmentDialog, ConfirmationDialog, UserDialog }
};
</script>

<style lang="scss">
.table-toolbar {
  background-color: #fff;
}

.checkbox-container {
  display: inline-block;

  .v-input {
    margin-bottom: 0;
    padding-top: 10px;
  }

  .v-input--selection-controls {
    .v-input__slot {
      margin-bottom: 0;
    }

    .v-input--selection-controls__input {
      margin-right: 0;
    }
  }
}

</style>
