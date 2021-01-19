<template>
  <div>
    <navbar />
    <div class="py-12">
      <v-progress-circular v-if="isLoading" size="50" indeterminate />
      <router-view v-else />
    </div>
  </div>
</template>

<script>
import api from '@/main/api/learner';
import head from 'lodash/head';
import { mapMutations } from 'vuex';
import Navbar from '@/main/components/common/Navbar';

export default {
  name: 'home',
  data: () => ({ isLoading: true }),
  methods: mapMutations('learner', ['setPrograms']),
  async created() {
    const { setPrograms, $route, $router } = this;
    const programs = await api.fetchPrograms();
    setPrograms(programs);
    if (programs.length !== 1 || $route.name === 'activity') return;
    const programId = head(programs).id;
    const isSameRoute = parseInt($route.params.programId, 10) === programId;
    if (!isSameRoute) $router.push({ name: 'courseware', params: { programId } });
    this.isLoading = false;
  },
  components: { Navbar }
};
</script>
