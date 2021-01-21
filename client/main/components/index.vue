<template>
  <div>
    <navbar />
    <div class="py-12">
      <circular-progress-bar v-if="isLoading" :width="50" :height="50" />
      <router-view v-else />
    </div>
  </div>
</template>

<script>
import api from '@/main/api/learner';
import CircularProgressBar from '@/main/components/common/CircularProgressBar';
import head from 'lodash/head';
import { mapMutations } from 'vuex';
import Navbar from '@/main/components/common/Navbar';

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
      .finally(() => { this.isLoading = false; });
  },
  components: { Navbar, CircularProgressBar }
};
</script>
