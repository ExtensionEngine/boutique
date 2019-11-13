<template>
  <div>
    <circular-progress-bar v-if="isLoading" :height="50" :width="50" />
    <router-view v-else />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import CircularProgressBar from '@/student/components/common/CircularProgressBar';
import find from 'lodash/find';

export default {
  name: 'program',
  props: {
    programId: { type: Number, required: true }
  },
  data: () => ({ isLoading: true }),
  computed: mapState('learner', ['programs']),
  methods: {
    ...mapActions('learner', ['fetchSyllabus']),
    ...mapMutations('learner', ['setCoursewareFilter'])
  },
  created() {
    if (!find(this.programs, { id: this.programId })) {
      return this.$router.push({ name: 'program-selection' });
    }
    this.setCoursewareFilter();
    this.fetchSyllabus(this.programId).finally(() => (this.isLoading = false));
  },
  components: { CircularProgressBar }
};
</script>
