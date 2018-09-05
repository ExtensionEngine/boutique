<template>
  <div>
    <div class="actions is-clearfix">
      <button
        @click="add"
        class="button is-primary is-pulled-right">
        Add
      </button>
    </div>
    <div v-if="!enrollments.length" class="notification is-warning">
      Click on the button above to enroll your first student.
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
      :programLevelId="programLevelId"
      @close="showModal = false">
    </enrollment-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import EnrollmentModal from './EnrollmentModal';
import filter from 'lodash/filter';

export default {
  name: 'enrollments',
  data() {
    return {
      showModal: false
    };
  },
  computed: {
    ...mapState('enrollments', { enrollmentStore: 'items' }),
    programLevelId() {
      return parseInt(this.$route.params.programLevelId, 10);
    },
    enrollments() {
      const { programLevelId } = this;
      return filter(this.enrollmentStore, { programLevelId });
    }
  },
  methods: {
    ...mapActions('enrollments', { fetchEnrollments: 'fetch' }),
    add() {
      this.showModal = true;
    }
  },
  created() {
    const { programLevelId } = this;
    return this.fetchEnrollments({ programLevelId });
  },
  components: { EnrollmentModal }
};
</script>

<style lang="scss" scoped>
.notification {
  margin-top: 10px;
}
</style>
