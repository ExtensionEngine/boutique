<template>
  <div>
    <div v-if="isLoading" class="loader-container">
      <circular-progress :height="50" :width="50"/>
    </div>
    <router-view v-else/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import CircularProgress from '@/student/components/common/CircularProgress';
import find from 'lodash/find';

export default {
  name: 'program',
  props: {
    programId: { type: Number, required: true }
  },
  data() {
    return { isLoading: true };
  },
  computed: mapState('learner', ['programs']),
  methods: mapActions('learner', ['fetchSyllabus']),
  created() {
    find(this.programs, { id: this.programId })
      ? this.fetchSyllabus(this.programId).then(() => (this.isLoading = false))
      : this.$router.push({ name: 'program-selection' });
  },
  components: { CircularProgress }
};
</script>

<style lang="scss" scoped>
.loader-container {
  display: flex;
  justify-content: center;
}
</style>
