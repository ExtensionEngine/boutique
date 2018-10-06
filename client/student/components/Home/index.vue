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
      <div v-else class="column is-4">
        <h1 class="title has-text-centered">Select your program</h1>
        <ul class="program-selection">
          <li v-for="it in programs" :key="it.id">
            <a
              @click.prevent="navigateTo(it.id)"
              class="button is-medium is-fullwidth">
              {{ it.name | truncate(25) }}
            </a>
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
  methods: {
    ...mapMutations('learner', ['setPrograms', 'selectProgram']),
    navigateTo(programId) {
      this.selectProgram(programId);
      this.$router.push({ name: 'courseware' });
    }
  },
  created() {
    api.fetchPrograms().then(programs => {
      this.setPrograms(programs);
      this.isLoading = false;
      if (programs.length !== 1) return;
      this.navigateTo(head(programs).id);
    });
  },
  components: { CircularProgress }
};
</script>

<style lang="scss" scoped>
.title {
  margin: 1rem 0 3rem;
  font-size: 1.5rem;
  font-weight: 300;
}

.program-selection li {
  margin-bottom: 20px;
}

.loader-container {
  display: flex;
  justify-content: center;
}
</style>
