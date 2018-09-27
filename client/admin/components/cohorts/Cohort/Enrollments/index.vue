<template>
  <div class="mt-3">
    <v-toolbar color="f5f5f5" flat>
      <v-spacer/>
      <enrollment-modal :cohortId="cohortId"/>
    </v-toolbar>
    <v-alert v-if="!enrollments.length" :value="true" color="#aaa" class="mr-4">
      Click on the button above to enroll learner.
    </v-alert>
    <div v-else class="elevation-1 ml-2 mr-4">
      <v-data-table :headers="headers" :items="enrollments" hide-actions>
        <template slot="items" slot-scope="props">
          <td>{{ props.item.student.email }}</td>
          <td>{{ props.item.student.firstName }}</td>
          <td>{{ props.item.student.lastName }}</td>
          <td>{{ props.item.createdAt | formatDate }}</td>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import EnrollmentModal from './EnrollmentModal';
import filter from 'lodash/filter';

export default {
  name: 'enrollments',
  props: { cohortId: { type: Number, required: true } },
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
  methods: mapActions('enrollments', ['fetch']),
  created() {
    return this.fetch({ cohortId: this.cohortId });
  },
  components: { EnrollmentModal }
};
</script>
