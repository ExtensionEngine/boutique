<template>
  <div>
    <div v-if="isLoading" class="loader-container">
      <circular-progress :height="50" :width="50"/>
    </div>
    <div v-else>
      <div v-if="!courseware.length" class="columns is-centered">
        <div class="notification is-warning has-text-centered">
          This Program doesn't have any courseware!
        </div>
      </div>
      <div v-else>
        <div v-show="!filteredCourseware.length" class="columns is-centered">
          <div class="notification is-warning has-text-centered">
            No courseware found!
          </div>
        </div>
        <div class="columns is-multiline">
          <activity-card
            v-for="it in filteredCourseware"
            :key="it.id"
            :activity="it"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import ActivityCard from './ActivityCard';
import CircularProgress from '../common/CircularProgress';

export default {
  name: 'courseware',
  data() {
    return {
      isLoading: true,
      query: ''
    };
  },
  computed: {
    ...mapGetters('learner', ['courseware', 'filteredCourseware']),
    ...mapState('learner', ['selectedProgramId'])
  },
  methods: mapActions('learner', ['fetchSyllabus']),
  created() {
    if (!this.selectedProgramId) return this.$router.push({ name: 'home' });
    this.fetchSyllabus(this.selectedProgramId)
      .then(() => (this.isLoading = false));
  },
  components: { ActivityCard, CircularProgress }
};
</script>

<style lang="scss" scoped>
.loader-container {
  display: flex;
  justify-content: center;
}

.notification {
  margin-top: 10px;
}
</style>
