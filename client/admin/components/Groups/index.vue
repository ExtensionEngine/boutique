<template>
  <v-container fluid>
    <v-row class="ma-5">
      <v-col sm="4" md="5" lg="4">
        <v-text-field
          v-model="filter"
          append-icon="mdi-magnify"
          label="Search"
          single-line hide-details clearable />
        <v-checkbox
          v-model="showArchived"
          label="Show archived"
          hide-details
          class="my-2 archived-checkbox" />
      </v-col>
      <v-col sm="8" md="7" lg="8" class="d-flex justify-end">
        <v-btn @click.stop="showGroupDialog()" text>
          <v-icon dense class="mr-1">mdi-plus</v-icon>Add group
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="groups"
      :server-items-length="totalItems"
      :options.sync="dataTable"
      must-sort
      class="ma-5 transparent">
      <template v-slot:item="{ item }">
        <router-link
          :key="item.id"
          :to="{ name: 'members', params: { groupId: item.id } }"
          tag="tr">
          <td>{{ item.name }}</td>
          <td class="text-no-wrap">{{ item.createdAt | formatDate }}</td>
          <td class="text-no-wrap">{{ item.users.length }}</td>
          <td class="text-no-wrap text-center">
            <v-btn
              @click="showGroupDialog(item)"
              color="grey darken-3"
              x-small icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              @click="archiveOrRestore(item)"
              color="grey darken-3"
              x-small icon>
              <v-icon>
                mdi-account-{{ item.deletedAt ? 'convert' : 'off' }}
              </v-icon>
            </v-btn>
          </td>
        </router-link>
      </template>
    </v-data-table>
    <group-dialog
      @updated="fetch(defaultPage)"
      @created="fetch(defaultPage)"
      :visible.sync="groupDialog"
      :group-data="editedGroup" />
    <confirmation-dialog
      @update:visible="confirmation = null"
      @confirmed="fetch()"
      v-bind="confirmation"
      :visible="!!confirmation" />
  </v-container>
</template>

<script>
import api from '@/admin/api/group';
import ConfirmationDialog from '../common/ConfirmationDialog';
import GroupDialog from './GroupDialog';
import humanize from 'humanize-string';
import throttle from 'lodash/throttle';

const defaultPage = () => ({ sortBy: ['updatedAt'], sortDesc: [true], page: 1 });

const headers = () => [
  { text: 'Group Name', value: 'name' },
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
  data: () => ({
    groups: [],
    filter: null,
    dataTable: defaultPage(),
    totalItems: 0,
    groupDialog: false,
    editedGroup: null,
    showArchived: false,
    confirmation: null
  }),
  computed: { headers, defaultPage },
  methods: {
    showGroupDialog(group = null) {
      this.editedGroup = group;
      this.groupDialog = true;
    },
    fetch: throttle(async function (opts) {
      Object.assign(this.dataTable, opts);
      const { dataTable, filter, showArchived: archived } = this;
      const { items, total } = await api.fetch({ dataTable, filter, archived });
      this.groups = items;
      this.totalItems = total;
    }, 400),
    archiveOrRestore(group) {
      const { name, deletedAt } = group;
      const action = deletedAt ? 'restore' : 'archive';
      this.confirmation = {
        heading: `${humanize(action)} group`,
        message: `Are you sure you want to ${action} group "${name}"?`,
        action: actions(group)[action]
      };
    }
  },
  watch: {
    dataTable: 'fetch',
    filter: 'fetch',
    showArchived: 'fetch'
  },
  components: { ConfirmationDialog, GroupDialog }
};
</script>
