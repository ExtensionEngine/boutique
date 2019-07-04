<template>
  <v-layout justify-center>
    <v-flex class="mt-5">
      <v-toolbar color="#f5f5f5" flat>
        <v-spacer/>
        <v-btn @click.stop="showGroupDialog()" color="success" outline>
          Add group
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
          must-sort
          :headers="headers"
          :items="groups"
          :total-items="totalItems"
          :pagination.sync="dataTable"
          class="group-table">
          <template slot="items" slot-scope="{ item }">
            <tr :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.description }}</td>
              <td class="no-wrap">{{ item.createdAt | formatDate }}</td>
              <td class="no-wrap">{{ item.users.length }}</td>
              <td class="no-wrap text-xs-center">
                <v-btn
                  @click="showGroupDialog(item)"
                  color="grey darken-2"
                  small
                  flat
                  icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  @click="archiveOrRestore(item)"
                  color="grey darken-2"
                  small
                  flat
                  icon>
                  <v-icon>
                    mdi-{{ item.deletedAt ? 'restore' : 'delete' }}
                  </v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
      <group-dialog
        @updated="fetch(defaultPage)"
        @created="fetch(defaultPage)"
        :visible.sync="groupDialog"
        :groupData="editedGroup"/>
      <confirmation-dialog
        @update:visible="confirmation = null"
        @confirmed="fetch()"
        v-bind="confirmation"
        :visible="!!confirmation"/>
    </v-flex>
  </v-layout>
</template>

<script>
import api from '@/admin/api/group';
import ConfirmationDialog from '../common/ConfirmationDialog';
import GroupDialog from './GroupDialog';
import humanize from 'humanize-string';
import throttle from 'lodash/throttle';

const defaultPage = () => ({ sortBy: 'updatedAt', descending: true, page: 1 });
const headers = () => [
  { text: 'Group Name', value: 'name' },
  { text: 'Group Description', value: 'description' },
  { text: 'Date Created', value: 'createdAt' },
  { text: 'Users', value: '' },
  { text: 'Actions', value: 'name', align: 'center', sortable: false }
];
const actions = group => ({
  archive: () => api.remove(group),
  restore: () => api.create(group)
});

export default {
  name: 'group-list',
  data() {
    return {
      groups: [],
      filter: null,
      dataTable: defaultPage(),
      totalItems: 0,
      groupDialog: false,
      editedGroup: null,
      showArchived: false,
      confirmation: null
    };
  },
  computed: {
    headers,
    defaultPage
  },
  methods: {
    showGroupDialog(group = null) {
      this.editedGroup = group;
      this.groupDialog = true;
    },
    fetch: throttle(async function (opts = {}) {
      const data = {
        ...this.dataTable,
        ...opts,
        filter: this.filter,
        archived: this.showArchived
      };
      const { items, total } = await api.fetch(data);
      this.groups = items;
      this.totalItems = total;
    }, 400),
    archiveOrRestore(group) {
      const action = group.deletedAt ? 'restore' : 'archive';
      const name = group.name;
      this.confirmation = {
        heading: `${humanize(action)} group`,
        message: `Are you sure you want to ${action} group "${name}"?`,
        action: actions(group)[action]
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
  components: { ConfirmationDialog, GroupDialog }
};
</script>

<style lang="scss" scoped>
.group-table /deep/ .v-input--checkbox {
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
