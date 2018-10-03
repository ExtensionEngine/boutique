<template>
  <div class="container is-fluid">
    <circular-progress v-if="isLoading" class="loader"/>
    <div v-else>
      <div v-if="!courseware.length" class="columns is-centered">
        <div class="notification is-warning has-text-centered">
          This Program doesn't have any courseware
        </div>
      </div>
      <div v-else class="columns is-multiline">
        <activity-card
          v-for="it in courseware"
          :key="it.id"
          :activity="it"/>
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
    ...mapGetters('learner', ['courseware']),
    ...mapState('learner', ['selectedProgram'])
  },
  methods: mapActions('learner', ['fetchSyllabus']),
  created() {
    if (!this.selectedProgram) return this.$router.push({ name: 'home' });
    this.fetchSyllabus(this.selectedProgram).then(() => (this.isLoading = false));
  },
  components: { ActivityCard, CircularProgress }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 0 300px;
}

.loader {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 50px;
  margin: auto;
}
</style>
