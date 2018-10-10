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
        <transition name="empty-courseware">
          <div v-show="!filteredCourseware.length" class="columns is-centered">
            <div class="notification is-warning has-text-centered">
              No courseware found!
            </div>
          </div>
        </transition>
        <transition-group
          name="courseware"
          class="columns is-multiline"
          tag="div">
          <activity-card
            v-for="it in filteredCourseware"
            :key="it.id"
            :activity="it"/>
        </transition-group>
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
    return { isLoading: true };
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

.courseware-enter-active {
  transition: all 0.5s;
}

.courseware-leave-active {
  position: absolute;
  transition: all 0.5s;
}

.courseware-enter, .courseware-leave-to {
  opacity: 0;
  transform: translateY(18rem);
}

.courseware-move {
  transition: all 0.5s;
}

.empty-courseware-enter-active, .empty-courseware-leave-active {
  transition: all 0.1s;
}

.empty-courseware-enter, .empty-courseware-leave-to {
  opacity: 0;
  transform: translateY(-10rem);
}
</style>
