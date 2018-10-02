<template>
  <div class="content container is-fluid">
    <circular-progress v-show="isLoading" class="loader"/>
    <div v-show="!isLoading" class="columns is-multiline">
      <card
        v-for="it in courseware"
        :key="it.id"
        :card="it"/>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import Card from './Card';
import CircularProgress from '../common/CircularProgress';

export default {
  name: 'courseware',
  data() {
    return { isLoading: true };
  },
  computed: {
    ...mapGetters('learner', ['courseware']),
    ...mapState('learner', ['selectedProgram'])
  },
  methods: mapActions('learner', ['fetchSyllabus']),
  mounted() {
    this.fetchSyllabus(this.selectedProgram).then(() => (this.isLoading = false));
  },
  components: { Card, CircularProgress }
};
</script>

<style lang="scss" scoped>
.content {
  padding: 30px 100px 100px;

  @media (min-width: 1700px) {
    padding: 30px 300px 100px;
  }
}

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
