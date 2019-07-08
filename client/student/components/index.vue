<template>
  <div>
    <navbar/>
    <div class="container">
      <div v-if="isLoading" class="loader-container">
        <circular-progress :width="50" :height="50"/>
      </div>
      <router-view v-else/>
    </div>
  </div>
</template>

<script>
import api from '@/student/api/learner';
import CircularProgress from '@/student/components/common/CircularProgress';
import head from 'lodash/head';
import { mapMutations } from 'vuex';
import Navbar from '@/student/components/common/Navbar';

export default {
  name: 'home',
  data() {
    return { isLoading: true };
  },
  methods: mapMutations('learner', ['setPrograms']),
  created() {
    const { setPrograms, $route, $router } = this;
    api.fetchPrograms()
      .then(programs => {
        setPrograms(programs);
        if (programs.length !== 1 || $route.name === 'activity') return;
        const programId = head(programs).id;
        $router.push({ name: 'courseware', params: { programId } });
      })
      .finally(() => (this.isLoading = false));
  },
  components: { Navbar, CircularProgress }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 50px 0;
}

.loader-container {
  display: flex;
  justify-content: center;
}
</style>
