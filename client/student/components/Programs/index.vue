<template>
  <div>
    <div class="columns is-centered">
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
import { mapState } from 'vuex';

export default {
  name: 'programs',
  computed: mapState('learner', ['programs'])
};
</script>

<style lang="scss" scoped>
.program-selection li {
  margin-bottom: 20px;
}
</style>
