<template>
  <div>
    <div class="actions is-clearfix">
      <button
        @click="add"
        class="button is-primary is-pulled-right">
        Add
      </button>
    </div>
    <div v-if="!courses.length" class="notification is-warning">
      Click on the button above to enroll your first student.
    </div>
    <table v-else class="table is-fullwidth is-hoverable">
      <thead>
        <th>ID</th>
        <th>Name</th>
      </thead>
      <tbody>
        <tr v-for="it in courses" :key="it.id">
          <td>{{ it.id }}</td>
          <td>{{ it.name }}</td>
        </tr>
      </tbody>
    </table>
    <content-modal
      :show="showModal"
      :programLevelId="programLevelId"
      @close="showModal = false">
    </content-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ContentModal from './ContentModal';
import filter from 'lodash/filter';

export default {
  name: 'content',
  data() {
    return {
      showModal: false
    };
  },
  computed: {
    ...mapState('courses', { coursesStore: 'items' }),
    courses() {
      const programLevelId = 2;
      return filter(this.coursesStore, { programLevelId });
    },
    programLevelId() {
      return parseInt(this.$route.params.programLevelId);
    }
  },
  methods: {
    ...mapActions('courses', { fetchCourses: 'fetch' }),
    add() {
      this.showModal = true;
    }
  },
  created() {
    return this.fetchCourses({ });
  },
  components: { ContentModal }
};
</script>

<style lang="scss" scoped>
.notification {
  margin-top: 10px;
}
</style>
