<template>
  <v-layout justify-center>
    <v-flex>
      <div class="mt-5">
        <v-toolbar color="#f5f5f5" flat>
          <v-spacer/>
          <v-btn @click.stop="showDialog()" color="success" outline>Add user</v-btn>
        </v-toolbar>
        <div class="elevation-1 ml-2 mr-4">
          <v-layout class="px-4 py-3 table-toolbar">
            <v-flex lg3 offset-lg9>
              <v-text-field
                v-model="filter"
                append-icon="search"
                label="Search"
                single-line
                hide-details/>
            </v-flex>
          </v-layout>
          <v-data-table
            :headers="headers"
            :items="users"
            :pagination.sync="dataTable"
            :total-items="totalItems"
            item-key="_cid">
            <template slot="items" slot-scope="{ item }">
              <td>{{ item.email }}</td>
              <td>{{ item.role }}</td>
              <td>{{ item.firstName }}</td>
              <td>{{ item.lastName }}</td>
              <td>
                <v-icon @click="showDialog(item)" small>edit</v-icon>
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
import api from '@/admin/api/user';
import throttle from 'lodash/throttle';
import UserModal from './UserModal';

export default {
  name: 'user-list',
  data() {
    return {
      dialogVisible: false,
      editedUser: null,
      users: [],
      filter: null,
      dataTable: { page: 1, rowsPerPage: 10 },
      totalItems: 0,
      isLoading: false
    };
  },
  computed: {
    headers: () => ([
      { text: 'Email', value: 'email', align: 'left' },
      { text: 'Role', value: 'role' },
      { text: 'First Name', value: 'firstName' },
      { text: 'Last Name', value: 'lastName' },
      { text: 'Actions', value: 'email', sortable: false }
    ])
  },
  methods: {
    showDialog(user = null) {
      this.editedUser = user;
      this.dialogVisible = true;
    },
    fetch: throttle(async function () {
      this.isLoading = true;
      const params = { ...this.dataTable, filter: this.filter };
      const { items, total } = await api.fetch(params);
      this.users = items;
      this.totalItems = total;
      this.isLoading = false;
    }, 400)
  },
  watch: {
    dataTable() {
      this.fetch();
    },
    filter() {
      this.fetch();
    }
  },
  components: { UserModal }
};
</script>

<style lang="scss" scoped>
.table-toolbar {
  background-color: #fff;
}
</style>
