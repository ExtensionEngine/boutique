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
      <div v-else class="columns is-multiline">
        <activity-card
          v-for="it in courseware"
          :key="it.id"
          :programId="programId"
          :activity="it"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ActivityCard from './ActivityCard';
import CircularProgress from '../common/CircularProgress';

export default {
  name: 'courseware',
  props: {
    programId: { type: Number, required: true }
  },
  data() {
    return { isLoading: true };
  },
  computed: mapGetters('learner', ['courseware']),
  methods: mapActions('learner', ['fetchSyllabus']),
  created() {
    this.fetchSyllabus(this.programId)
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
</style>
