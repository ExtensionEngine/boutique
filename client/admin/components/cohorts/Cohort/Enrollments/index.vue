<template>
  <div>
    <div class="actions is-clearfix">
      <button
        @click="add"
        class="button is-primary is-pulled-right">
        Enroll learner
      </button>
    </div>
    <div v-if="!enrollments.length" class="notification is-warning">
      Click on the button above to enroll learner.
    </div>
    <table v-else class="table is-fullwidth is-hoverable">
      <thead>
        <th>Email</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Enrolled At</th>
      </thead>
      <tbody>
        <tr v-for="it in enrollments" :key="it._cid">
          <td>{{ it.student.email }}</td>
          <td>{{ it.student.firstName }}</td>
          <td>{{ it.student.lastName }}</td>
          <td>{{ it.createdAt }}</td>
        </tr>
      </tbody>
    </table>
    <enrollment-modal
      :show="showModal"
      :cohortId="cohortId"
      @close="showModal = false"/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import EnrollmentModal from './EnrollmentModal';
import filter from 'lodash/filter';

export default {
  name: 'enrollments',
  props: { cohortId: { type: Number, required: true } },
  data() {
    return {
      showModal: false
    };
  },
  computed: {
    ...mapState('enrollments', { enrollmentStore: 'items' }),
    enrollments() {
      const { cohortId } = this;
      return filter(this.enrollmentStore, { cohortId });
    }
  },
  methods: {
    ...mapActions('enrollments', ['fetch']),
    add() {
      this.showModal = true;
    }
  },
  created() {
    return this.fetch({ cohortId: this.cohortId });
  },
  components: { EnrollmentModal }
};
</script>

<style lang="scss" scoped>
.notification {
  margin-top: 10px;
}
</style>
