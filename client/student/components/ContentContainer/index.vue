<template>
  <div class="container">
    <nav class="navbar is-light" role="navigation">
      <router-link
        v-for="it in siblings"
        :key="it.id"
        :to="{ name: 'content-container', params: { containerId: it.container.id}}"
        class="navbar-item">
        {{ it.name | truncate(25) }}
      </router-link>
    </nav>
    <teaching-elements
      :containerId="containerId"
      :repositoryId="activity.repositoryId"
      :key="containerId"/>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import filter from 'lodash/filter';
import find from 'lodash/find';
import TeachingElements from './TeachingElements';

export default {
  name: 'content-container',
  computed: {
    ...mapGetters('learner', ['courseware']),
    ...mapState('learner', ['selectedProgram']),
    containerId() {
      return this.$route.params.containerId;
    },
    activity() {
      return find(this.courseware, { container: { id: this.containerId } });
    },
    siblings() {
      return filter(this.courseware, { parentId: this.activity.parentId });
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
