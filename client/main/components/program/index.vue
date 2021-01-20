<template>
  <div>
    <v-progress-circular v-if="isLoading" size="50" indeterminate />
    <router-view v-else />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
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
    const { programs, programId } = this;
    const program = find(programs, { id: programId });
    if (!program) return this.$router.push({ name: 'program-selection' });
    this.setCoursewareFilter();
    return this.fetchSyllabus(programId)
      .then(() => (this.isLoading = false));
  }
};
</script>
