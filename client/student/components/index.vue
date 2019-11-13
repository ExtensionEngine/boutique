<template>
  <div>
    <navbar />
    <div class="container">
      <circular-progress-bar v-if="isLoading" :width="50" :height="50" />
      <router-view v-else />
    </div>
  </div>
</template>

<script>
import api from '@/student/api/learner';
import CircularProgressBar from '@/student/components/common/CircularProgressBar';
import head from 'lodash/head';
import { mapMutations } from 'vuex';
import Navbar from '@/student/components/common/Navbar';

export default {
  name: 'home',
  data: () => ({ isLoading: true }),
  methods: mapMutations('learner', ['setPrograms']),
  created() {
    const { setPrograms, $route, $router } = this;
    return api.fetchPrograms()
      .then(programs => {
        setPrograms(programs);
        if (programs.length !== 1 || $route.name === 'activity') return;
        const programId = head(programs).id;
        $router.push({ name: 'courseware', params: { programId } });
      })
      .finally(() => {
        this.isLoading = false;
      });
  },
  components: { Navbar, CircularProgressBar }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 50px 0;
}
</style>
