<template>
  <div class="mt-3">
    <v-toolbar color="#f5f5f5" flat>
      <v-spacer/>
      <enrollment-modal :cohortId="cohortId"/>
    </v-toolbar>
    <v-alert
      :value="!isLoading && !enrollments.length"
      color="#aaa"
      class="mr-4">
      Click on the button above to enroll learner.
    </v-alert>
    <div v-if="enrollments.length" class="elevation-1 ml-2 mr-4">
      <v-data-table
        :headers="headers"
        :items="enrollments"
        item-key="_cid"
        hide-actions>
        <template slot="items" slot-scope="{ item }">
          <td>{{ get(item.student, 'email') }}</td>
          <td>{{ get(item.student, 'firstName') }}</td>
          <td>{{ get(item.student, 'lastName') }}</td>
          <td>{{ item.createdAt | formatDate }}</td>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import EnrollmentModal from './EnrollmentModal';
import filter from 'lodash/filter';
import get from 'lodash/get';

export default {
  name: 'enrollments',
  props: { cohortId: { type: Number, required: true } },
  data() {
    return { isLoading: true };
  },
  computed: {
    ...mapState('enrollments', { enrollmentStore: 'items' }),
    headers: () => ([
      { text: 'Email', value: 'email', align: 'left' },
      { text: 'First Name', value: 'firstName' },
      { text: 'Last Name', value: 'lastName' },
      { text: 'Created At', value: 'createdAt' }
    ]),
    enrollments() {
      const { cohortId } = this;
      return filter(this.enrollmentStore, { cohortId });
    }
  },
  methods: {
    ...mapActions('enrollments', ['fetch']),
    get
  },
  created() {
    return this.fetch({ cohortId: this.cohortId })
      .then(() => (this.isLoading = false));
  },
  components: { EnrollmentModal }
};
</script>
