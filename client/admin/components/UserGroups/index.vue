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
          <v-icon dense class="mr-1">mdi-plus</v-icon>Add user group
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="userGroups"
      :server-items-length="totalItems"
      :options.sync="dataTable"
      must-sort
      class="ma-5 transparent">
      <template v-slot:item="{ item }">
        <router-link
          :key="item.id"
          :to="{ name: 'members', params: { userGroupId: item.id } }"
          tag="tr">
          <td>{{ item.name }}</td>
          <td class="text-no-wrap">{{ item.createdAt | formatDate }}</td>
          <td class="text-no-wrap">{{ item.members.length }}</td>
          <td class="text-no-wrap text-center">
            <v-btn
              @click.stop="showGroupDialog(item)"
              color="grey darken-3"
              x-small icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              @click.stop="archiveOrRestore(item)"
              color="grey darken-3"
              x-small icon>
              <v-icon>
                mdi-{{ item.deletedAt ? 'restore' : 'archive-outline' }}
              </v-icon>
            </v-btn>
          </td>
        </router-link>
      </template>
    </v-data-table>
    <user-group-dialog
      @updated="fetch(defaultPage)"
      @created="fetch(defaultPage)"
      :visible.sync="userGroupDialog"
      :user-group-data="editedUserGroup" />
    <confirmation-dialog
      @update:visible="confirmation = null"
      @confirmed="fetch()"
      v-bind="confirmation"
      :visible="!!confirmation" />
  </v-container>
</template>

<script>
import api from '@/admin/api/userGroup';
import ConfirmationDialog from '../common/ConfirmationDialog';
import humanize from 'humanize-string';
import throttle from 'lodash/throttle';
import UserGroupDialog from './UserGroupDialog';

const defaultPage = () => ({ sortBy: ['updatedAt'], sortDesc: [true], page: 1 });

const headers = () => [
  { text: 'User Group Name', value: 'name' },
  { text: 'Date Created', value: 'createdAt' },
  { text: 'Users', value: '' },
  { text: 'Actions', value: 'name', align: 'center', sortable: false }
];

const actions = userGroup => ({
  archive: () => api.remove(userGroup),
  restore: () => api.create(userGroup)
});

export default {
  name: 'user-group-list',
  data: () => ({
    userGroups: [],
    filter: null,
    dataTable: defaultPage(),
    totalItems: 0,
    userGroupDialog: false,
    editedUserGroup: null,
    showArchived: false,
    confirmation: null
  }),
  computed: { headers, defaultPage },
  methods: {
    showGroupDialog(userGroup = null) {
      this.editedUserGroup = userGroup;
      this.userGroupDialog = true;
    },
    fetch: throttle(async function (opts) {
      Object.assign(this.dataTable, opts);
      const { dataTable, filter, showArchived: archived } = this;
      const params = { filter, archived };
      const { items, total } = await api.fetch({ ...dataTable, params });
      this.userGroups = items;
      this.totalItems = total;
    }, 400),
    archiveOrRestore(userGroup) {
      const { name, deletedAt } = userGroup;
      const action = deletedAt ? 'restore' : 'archive';
      this.confirmation = {
        heading: `${humanize(action)} user group`,
        message: `Are you sure you want to ${action} user group "${name}"?`,
        action: actions(userGroup)[action]
      };
    }
  },
  watch: {
    dataTable: 'fetch',
    filter: 'fetch',
    showArchived: 'fetch'
  },
  components: { ConfirmationDialog, UserGroupDialog }
};
</script>

<style lang="scss" scoped>
::v-deep .archived-checkbox {
  &.v-input--checkbox {
    justify-content: flex-end;
  }

  .v-input__slot {
    flex-direction: row-reverse;

    .v-input--selection-controls__input {
      margin-right: 0;
    }

    .v-icon {
      font-size: 1.125rem;
    }

    label {
      font-size: 0.875rem;
    }
  }
}
</style>
