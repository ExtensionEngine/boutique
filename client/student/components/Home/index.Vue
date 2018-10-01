<template>
  <div class="columns is-centered">
    <div class="column is-2">
      <h1 class="subtitle has-text-centered">Select your Program:</h1>
      <ul>
        <li
          v-for="it in programs"
          :key="it.id"
          @click="selectProgram(it.cohortId)"
        >
          <router-link
            :to="{ name: 'courseware' }"
            class="button is-medium is-fullwidth"
          >
            {{ it.cohort.name }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'learner-home',
  computed: {
    ...mapState('auth', ['user']),
    ...mapState('learner', ['programs'])
  },
  methods: mapActions('learner', ['fetchPrograms', 'selectProgram']),
  created() {
    this.fetchPrograms(this.user.id);
  }
};
</script>

<style lang="scss">
</style>
