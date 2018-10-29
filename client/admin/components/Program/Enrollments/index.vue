<template>
  <div class="mt-3">
    <v-toolbar color="#f5f5f5" flat>
      <v-spacer/>
      <enrollment-dialog :programId="programId" @enrolled="fetch(defaultPage)"/>
    </v-toolbar>
    <v-alert
      :value="!isLoading && !totalItems"
      color="#aaa"
      class="mr-4">
      Click on the button above to enroll learner.
    </v-alert>
    <div v-show="totalItems" class="elevation-1 ml-2 mr-4">
      <v-data-table
        :headers="headers"
        :items="enrollments"
        :pagination.sync="dataTable"
        :total-items="totalItems"
        :must-sort="true">
        <template slot="items" slot-scope="{ item }">
          <td>{{ get(item.student, 'email') }}</td>
          <td>{{ get(item.student, 'firstName') }}</td>
          <td>{{ get(item.student, 'lastName') }}</td>
          <td>{{ item.createdAt | formatDate }}</td>
          <td class="text-md-center">
            <v-icon @click="unenroll(item)" small>mdi-delete</v-icon>
          </td>
        </template>
      </v-data-table>
    </div>
    <confirmation-dialog
      :visible.sync="confirmationDialog"
      :action="confirmationAction"
      @confirmed="fetch()"
      heading="Unenroll"
      message="Are you sure you want to unenroll learner?"/>
  </div>
</template>

<script>
import api from '@/admin/api/enrollment';
import ConfirmationDialog from '@/admin/components/common/ConfirmationDialog';
import EnrollmentDialog from './EnrollmentDialog';
import get from 'lodash/get';
import throttle from 'lodash/throttle';

const defaultPage = () => ({ sortBy: 'updatedAt', descending: true, page: 1 });

export default {
  name: 'enrollments',
  props: { programId: { type: Number, required: true } },
  data() {
    return {
      enrollments: [],
      dataTable: { rowsPerPage: 10, ...defaultPage() },
      totalItems: 0,
      confirmationDialog: null,
      confirmationAction: null,
      isLoading: true
    };
  },
  computed: {
    headers: () => ([
      { text: 'Email', value: 'student.email', align: 'left' },
      { text: 'First Name', value: 'student.first_name' },
      { text: 'Last Name', value: 'student.last_name' },
      { text: 'Created At', value: 'createdAt' },
      { text: 'Actions', value: 'id', sortable: false, align: 'center' }
    ]),
    defaultPage
  },
  methods: {
    get,
    fetch: throttle(async function (opts) {
      this.isLoading = true;
      Object.assign(this.dataTable, opts);
      const params = { programId: this.programId };
      const { items, total } = await api.fetch({ ...this.dataTable, params });
      this.enrollments = items;
      this.totalItems = total;
      this.isLoading = false;
    }, 400),
    unenroll(enrollment) {
      this.confirmationDialog = true;
      this.confirmationAction = () => api.remove(enrollment);
    }
  },
  watch: {
    dataTable() {
      this.fetch();
    }
  },
  components: { ConfirmationDialog, EnrollmentDialog }
};
</script>
