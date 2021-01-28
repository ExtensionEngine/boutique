<template>
  <v-row justify="center">
    <v-col class="mt-5">
      <v-toolbar color="#f5f5f5" flat>
        <v-spacer />
        <v-btn @click.stop="showGroupDialog()" color="success" outlined class="ml-4">
          Add group
        </v-btn>
      </v-toolbar>
      <div class="elevation-1 ml-2 mr-4">
        <v-row justify="end" no-gutters class="px-4 table-toolbar">
          <v-col lg="4">
            <v-text-field
              v-model="filter"
              append-icon="mdi-magnify"
              label="Search"
              single-line hide-details clearable />
            <v-checkbox
              v-model="showArchived"
              label="Show archived"
              class="my-2 archived-checkbox"
              hide-details />
          </v-col>
        </v-row>
        <v-data-table
          v-model="selectedGroups"
          :headers="headers"
          :items="groups"
          :server-items-length="totalItems"
          :options.sync="dataTable"
          show-select must-sort
          class="group-table">
          <template v-slot:item="props">
            <tr :key="props.item.id">
              <td>
                <v-checkbox v-model="props.isSelected" hide-details />
              </td>
              <td>{{ props.item.name }}</td>
              <td class="text-no-wrap">{{ props.item.createdAt | formatDate }}</td>
              <td class="text-no-wrap">{{ props.item.users.length }}</td>
              <td class="text-no-wrap text-center">
                <v-btn
                  @click="showGroupDialog(props.item)"
                  color="grey darken-2"
                  small text icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  @click="archiveOrRestore(props.item)"
                  color="grey darken-2"
                  small text icon>
                  <v-icon>
                    mdi-account-{{ props.item.deletedAt ? 'convert' : 'off' }}
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
        :group-data="editedGroup" />
      <confirmation-dialog
        @update:visible="confirmation = null"
        @confirmed="fetch()"
        v-bind="confirmation"
        :visible="!!confirmation" />
    </v-col>
  </v-row>
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
    selectedGroups: [],
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

<style lang="scss" scoped>
.group-table ::v-deep .v-input--checkbox {
  justify-content: center;
  margin-top: 0;
}

::v-deep .archived-checkbox {
  &.v-input--checkbox {
    justify-content: flex-end;
  }

  .v-input__slot {
    flex-direction: row-reverse;

    .v-input--selection-controls__input {
      justify-content: center;
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
