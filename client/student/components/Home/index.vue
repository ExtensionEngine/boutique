<template>
  <div class="columns is-centered">
    <div class="column is-2">
      <h1 class="subtitle has-text-centered">Select your Program:</h1>
      <ul>
        <li
          v-for="it in programs"
          :key="it.id"
          @click="selectProgram(it.cohortId)">
          <router-link
            :to="{ name: 'courseware' }"
            class="button is-medium is-fullwidth">
            {{ it.cohort.name }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  name: 'learner-home',
  computed: {
    ...mapState('learner', ['programs'])
  },
  methods: {
    ...mapActions('learner', ['fetchPrograms']),
    ...mapMutations('learner', ['selectProgram'])
  },
  created() {
    this.fetchPrograms();
  }
};
</script>
