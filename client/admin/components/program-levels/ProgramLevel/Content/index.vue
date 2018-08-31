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
      Click on the button above to add your first course.
    </div>
    <table v-else class="table is-fullwidth is-hoverable">
      <thead>
        <th>Name</th>
        <th>Published At</th>
        <th>Updated At</th>
        <th>Sync</th>
      </thead>
      <tbody>
        <tr v-for="it in courses" :key="it._cid">
          <td>{{ it.name }}</td>
          <td>{{ it.publishedAt | formatDate }}</td>
          <td>{{ it.updatedAt | formatDate }}</td>
          <td><button @click="sync(it.id, it.sourceId)" class="control button">Sync</button></td>
        </tr>
      </tbody>
    </table>
    <content-modal
      :show="showModal"
      :programLevelId="programLevelId"
      :importedCourses="courses"
      @close="showModal = false">
    </content-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ContentModal from './ContentModal';
import coursesApi from '@/admin/api/coursesApi';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import pick from 'lodash/pick';

export default {
  name: 'content-component',
  data() {
    return {
      showModal: false
    };
  },
  computed: {
    ...mapState('courses', { coursesStore: 'items' }),
    courses() {
      const { programLevelId } = this;
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
    },
    sync(courseId, sourceId) {
      const { programLevelId } = this;
      coursesApi.syncCourse(courseId, programLevelId, sourceId)
        .then(({ data: { data } }) => {
          const courseIndex = findIndex(this.courses,
            pick(data, ['id', 'courseId', 'programLevelId']));
          this.courses[courseIndex] = data;
          return this.fetchCourses({ programLevelId });
        });
    }
  },
  created() {
    const { programLevelId } = this;
    return this.fetchCourses({ programLevelId });
  },
  components: { ContentModal }
};
</script>

<style lang="scss" scoped>
.notification {
  margin-top: 10px;
}
</style>
