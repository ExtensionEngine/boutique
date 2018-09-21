<template>
  <div class="courses container is-fluid">
    <div class="columns is-multiline">
      <card
        v-for="it in courses"
        :key="it._cid"
        :course="it"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Card from './Card';

export default {
  name: 'courses',
  computed: mapState('courses', { courses: 'items' }),
  methods: mapActions('courses', ['fetch']),
  created() {
    this.fetch();
  },
  components: { Card }
};
</script>

<style lang="scss" scoped>
.courses {
  padding: 30px 100px 100px;

  @media (min-width: 1700px) {
    padding: 30px 300px 100px;
  }
}
</style>
