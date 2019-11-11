<template>
  <div class="mt-3">
    <v-toolbar color="#f5f5f5" flat>
      <v-spacer />
      <enrollment-dialog @enrolled="fetch(defaultPage)" :program-id="programId" />
    </v-toolbar>
    <div class="elevation-1 ml-2 mr-4">
      <v-layout class="px-4 py-3 table-toolbar">
        <v-flex lg3 offset-lg9>
          <v-text-field
            v-model.trim="filter"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            clearable />
        </v-flex>
      </v-layout>
      <v-data-table
        :headers="headers"
        :items="enrollments"
        :pagination.sync="dataTable"
        :total-items="totalItems"
        :must-sort="true"
        :no-data-text="noEnrollmentsMessage">
        <template slot="items" slot-scope="{ item }">
          <td>{{ get(item.student, 'email') }}</td>
          <td>{{ get(item.student, 'firstName') }}</td>
          <td>{{ get(item.student, 'lastName') }}</td>
          <td class="no-wrap">{{ item.createdAt | formatDate }}</td>
          <td class="text-xs-center">
            <v-icon @click="unenroll(item)" small>mdi-delete</v-icon>
          </td>
        </template>
      </v-data-table>
    </div>
    <confirmation-dialog
      @confirmed="fetch()"
      :visible.sync="confirmation.dialog"
      :action="confirmation.action"
      :message="confirmation.message"
      heading="Unenroll" />
  </div>
</template>

<script>
import api from '@/admin/api/enrollment';
import ConfirmationDialog from '@/admin/components/common/ConfirmationDialog';
import EnrollmentDialog from './EnrollmentDialog';
import get from 'lodash/get';
import pick from 'lodash/pick';
import throttle from 'lodash/throttle';

const defaultPage = () => ({ sortBy: 'updatedAt', descending: true, page: 1 });
const fullName = student => `${student.firstName} ${student.lastName}`;
const headers = () => [
  { text: 'Email', value: 'student.email', align: 'left' },
  { text: 'First Name', value: 'student.first_name' },
  { text: 'Last Name', value: 'student.last_name' },
  { text: 'Created At', value: 'createdAt' },
  { text: 'Actions', value: 'id', sortable: false, align: 'center' }
];

export default {
  name: 'enrollments',
  props: { programId: { type: Number, required: true } },
  data() {
    return {
      enrollments: [],
      filter: null,
      dataTable: { rowsPerPage: 10, ...defaultPage() },
      totalItems: 0,
      confirmation: { dialog: null }
    };
  },
  computed: {
    headers,
    defaultPage,
    noEnrollmentsMessage() {
      return this.filter
        ? `Your search for "${this.filter}" found no results.`
        : 'Click on the button above to enroll learner.';
    }
  },
  methods: {
    get,
    fetch: throttle(async function (opts) {
      Object.assign(this.dataTable, opts);
      const params = pick(this, ['programId', 'filter']);
      const { items, total } = await api.fetch({ ...this.dataTable, params });
      this.enrollments = items;
      this.totalItems = total;
    }, 400),
    unenroll(enrollment) {
      const { student } = enrollment;
      Object.assign(this.confirmation, {
        message: `Are you sure you want to unenroll "${fullName(student)}"?`,
        action: () => api.remove(enrollment),
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
    }
  },
  components: { ConfirmationDialog, EnrollmentDialog }
};
</script>
