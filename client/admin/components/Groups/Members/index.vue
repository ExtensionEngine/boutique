<template>
  <v-row justify="center">
    <v-col class="mt-5">
      <v-toolbar color="#f5f5f5" flat>
        <v-spacer />
        <v-btn @click.stop="showMemberDialog()" color="success" outlined class="ml-4">
          Add member
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
          v-model="selectedMembers"
          :headers="headers"
          :items="members"
          :server-items-length="totalItems"
          :options.sync="dataTable"
          must-sort
          class="member-table">
          <template v-slot:item="{ item }">
            <tr :key="item.id">
              <td>{{ item.email }}</td>
              <td>{{ item.role }}</td>
              <td>{{ item.firstName }}</td>
              <td>{{ item.lastName }}</td>
              <td class="text-no-wrap">{{ item.createdAt | formatDate }}</td>
              <td class="text-no-wrap text-center">
                <v-btn
                  @click="showMemberDialog(item)"
                  color="grey darken-2"
                  small text icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  @click="archiveOrRestore(item)"
                  color="grey darken-2"
                  small text icon>
                  <v-icon>
                    mdi-account-{{ item.deletedAt ? 'convert' : 'off' }}
                  </v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
      <member-dialog
        @updated="fetch(defaultPage)"
        @created="fetch(defaultPage)"
        :visible.sync="memberDialog"
        :member-data="editedMember"
        :group-id="groupId" />
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
import ConfirmationDialog from '../../common/ConfirmationDialog';
import humanize from 'humanize-string';
import MemberDialog from './MemberDialog';
import throttle from 'lodash/throttle';

const defaultPage = () => ({ sortBy: ['updatedAt'], sortDesc: [true], page: 1 });

const headers = () => [
  { text: 'Email', value: 'email' },
  { text: 'Role', value: 'role' },
  { text: 'First Name', value: 'firstName' },
  { text: 'Last Name', value: 'lastName' },
  { text: 'Date Created', value: 'createdAt' },
  { text: 'Actions', value: 'email', align: 'center', sortable: false }
];

const actions = member => ({
  archive: () => api.remove(member),
  restore: () => api.create(member)
});

export default {
  name: 'member-list',
  props: {
    groupId: { type: Number, required: true }
  },
  data: () => ({
    members: [],
    selectedMembers: [],
    filter: null,
    dataTable: defaultPage(),
    totalItems: 0,
    memberDialog: false,
    editedMember: null,
    showArchived: false,
    confirmation: null
  }),
  computed: { headers, defaultPage },
  methods: {
    showMemberDialog(member = null) {
      this.editedMember = member;
      this.memberDialog = true;
    },
    fetch: throttle(async function (opts) {
      Object.assign(this.dataTable, opts);
      const { dataTable, filter, showArchived: archived } = this;
      const { items, total } = await api.fetch({ dataTable, filter, archived });
      this.members = items;
      this.totalItems = total;
    }, 400),
    archiveOrRestore(member) {
      const { firstName, lastName, deletedAt } = member;
      const action = deletedAt ? 'restore' : 'archive';
      const name = `${firstName} ${lastName}`;
      this.confirmation = {
        heading: `${humanize(action)} member`,
        message: `Are you sure you want to ${action} member "${name}"?`,
        action: actions(member)[action]
      };
    }
  },
  watch: {
    dataTable: 'fetch',
    filter: 'fetch',
    showArchived: 'fetch'
  },
  components: { ConfirmationDialog, MemberDialog }
};
</script>

<style lang="scss" scoped>
.member-table ::v-deep .v-input--checkbox {
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
