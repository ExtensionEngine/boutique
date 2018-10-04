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
      :containerId="containerId"
      :repositoryId="repositoryId"
      :key="containerId"/>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import find from 'lodash/find';
import TeachingElements from './TeachingElements';

export default {
  name: 'content-container',
  props: {
    repositoryId: { type: Number, required: true },
    activityId: { type: Number, required: true },
    containerId: { type: Number, required: true }
  },
  computed: {
    ...mapGetters('learner', ['courseware']),
    ...mapState('learner', ['selectedProgram']),
    activity() {
      return find(this.courseware, { subActivites: [{ id: this.activityId }] });
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
