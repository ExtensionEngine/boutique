<template>
  <div>
    <circular-progress v-show="isLoading" class="loader"/>
    <div v-show="!isLoading" class="columns is-centered">
      <div v-show="!programs.length" class="column is-4">
        <h1 class="subtitle has-text-centered">
          You aren't enrolled in any Program
        </h1>
      </div>
      <div v-show="programs.length" class="column is-2">
        <h1 class="subtitle has-text-centered">Select your Program:</h1>
        <ul>
          <li
            v-for="it in programs"
            :key="it.id"
            @click="navigateTo(it.id)"
            class="button is-medium is-fullwidth">
            {{ it.name }}
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
