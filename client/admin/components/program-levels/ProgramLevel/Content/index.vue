<template>
  <div>
    <div class="actions is-clearfix">
      <button
        @click="showModal = true"
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
        <th>Repo Version</th>
        <th>Synced Version</th>
        <th>Sync</th>
      </thead>
      <tbody>
        <tr v-for="it in courses" :key="it._cid">
          <td>{{ it.name }}</td>
          <td>{{ it.repoVersion | formatDate }}</td>
          <td>{{ it.publishedAt | formatDate }}</td>
          <td>
            <button
              v-if="it.repoVersion > it.publishedAt"
              @click="saveCourse(it)"
              type="button"
              class="control button">
              Sync
            </button>
            <span v-else-if="it.repoVersion">Synced</span>
          </td>
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
import filter from 'lodash/filter';

export default {
  name: 'content-component',
  data() {
    return { showModal: false };
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
    ...mapActions('courses', { fetchCourses: 'fetch', saveCourse: 'save' })
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
