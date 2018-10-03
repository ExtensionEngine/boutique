<template>
  <div class="container">
    <nav class="navbar is-light" role="navigation">
      <router-link
        v-for="it in activity.subActivites"
        :key="it.id"
        :to="{ name: 'content-container', params: { activityId: it.id, containerId: it.contentContainers[0].id }}"
        class="navbar-item">
        {{ it.name | truncate(25) }}
      </router-link>
    </nav>
    <teaching-elements
      :containerId="routeParams.containerId"
      :repositoryId="routeParams.repositoryId"
      :key="routeParams.containerId"/>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import find from 'lodash/find';
import TeachingElements from './TeachingElements';

export default {
  name: 'content-container',
  computed: {
    ...mapGetters('learner', ['courseware']),
    ...mapState('learner', ['selectedProgram']),
    routeParams() {
      return this.$route.params;
    },
    activity() {
      return find(this.courseware, { subActivites: [{ id: this.routeParams.activityId }] });
    }
  },
  created() {
    if (!this.selectedProgram) return this.$router.push({ name: 'home' });
  },
  components: { TeachingElements }
};
</script>

<style lang="scss" scoped>
.router-link-exact-active {
  color: #3273dc;
}
</style>
