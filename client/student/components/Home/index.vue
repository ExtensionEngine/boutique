<template>
  <div>
    <div v-if="isLoading" class="loader-container">
      <circular-progress :width="50" :height="50"/>
    </div>
    <div v-else class="columns is-centered">
      <div v-if="!programs.length" class="column is-4">
        <div class="notification is-warning has-text-centered">
          You aren't enrolled in any Program!
        </div>
      </div>
      <div v-else class="column is-3">
        <h1 class="subtitle has-text-centered">Select your Program:</h1>
        <ul class="program-selection">
          <li v-for="it in programs" :key="it.id">
            <router-link
              :to="{ name: 'courseware', params: { programId: it.id } }"
              class="button is-medium is-fullwidth">
              {{ it.name | truncate(25) }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import api from '@/student/api/learner';
import CircularProgress from '../common/CircularProgress';
import head from 'lodash/head';

export default {
  name: 'home',
  data() {
    return { isLoading: true };
  },
  computed: mapState('learner', ['programs']),
  methods: mapMutations('learner', ['setPrograms']),
  created() {
    api.fetchPrograms().then(programs => {
      this.setPrograms(programs);
      this.isLoading = false;
      if (programs.length !== 1) return;
      const programId = head(programs).id;
      this.$router.push({ name: 'courseware', params: { programId } });
    });
  },
  components: { CircularProgress }
};
</script>

<style lang="scss" scoped>
.program-selection li {
  margin-bottom: 20px;
}

.loader-container {
  display: flex;
  justify-content: center;
}
</style>
