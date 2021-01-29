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
        <v-btn @click.stop="showMemberDialog()" text>
          <v-icon dense class="mr-1">mdi-plus</v-icon>Add group
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="members"
      :server-items-length="totalItems"
      :options.sync="dataTable"
      must-sort
      class="ma-5 transparent">
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
        </tr>
      </template>
    </v-data-table>
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
  </v-container>
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
