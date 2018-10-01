<template>
  <div class="content container is-fluid">
    <div class="columns is-multiline">
      <card
        v-for="it in courseware"
        :key="it._cid"
        :courseware="it"/>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import Card from './Card';

export default {
  name: 'courseware',
  computed: {
    ...mapGetters('learner', ['courseware']),
    ...mapState('learner', ['selectedProgram'])
  },
  methods: mapActions('learner', ['fetchSyllabus']),
  created() {
    this.fetchSyllabus(this.selectedProgram);
  },
  components: { Card }
};
</script>

<style lang="scss" scoped>
.content {
  padding: 30px 100px 100px;

  @media (min-width: 1700px) {
    padding: 30px 300px 100px;
  }
}
</style>
