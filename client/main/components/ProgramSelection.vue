<template>
  <div class="d-flex justify-center">
    <v-alert v-if="!programs.length" color="warning" class="d-inline-block text-center">
      You aren't enrolled in any Program!
    </v-alert>
    <div v-else>
      <h1 class="title">Select your program</h1>
      <v-btn
        v-for="it in programs"
        :key="it.id"
        :to="{ name: 'courseware', params: { programId: it.id } }"
        class="d-flex mb-5">
        {{ it.name | truncate(25) }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'program-selection',
  computed: mapState('learner', ['programs'])
};
</script>

<style lang="scss" scoped>
.title {
  margin: 1rem 0 3rem;
  font-size: 1.5rem;
  font-weight: 300;
}
</style>
