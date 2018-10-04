<template>
  <div>
    <nav class="navbar is-light" role="navigation">
      <router-link
        v-for="it in navigationItems"
        :key="it.id"
        :to="{
          name: 'activity',
          params: {
            repositoryId,
            activityId: it.id,
            containerId: it.contentContainers[0].id
          }
        }"
        class="navbar-item">
        {{ it.name | truncate(25) }}
      </router-link>
    </nav>
    <content-container
      :containerId="containerId"
      :repositoryId="repositoryId"
      :key="containerId"/>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import ContentContainer from './ContentContainer';
import find from 'lodash/find';

export default {
  name: 'activity',
  props: {
    repositoryId: { type: Number, required: true },
    activityId: { type: Number, required: true },
    containerId: { type: Number, required: true }
  },
  computed: {
    ...mapGetters('learner', ['isSingleLevel', 'courseware']),
    ...mapState('learner', ['selectedProgram']),
    navigationItems() {
      const findCond = { subActivities: [{ id: this.activityId }] };
      return this.isSingleLevel
        ? this.courseware
        : find(this.courseware, findCond).subActivities;
    }
  },
  created() {
    if (!this.selectedProgram) return this.$router.push({ name: 'home' });
  },
  components: { ContentContainer }
};
</script>

<style lang="scss" scoped>
.router-link-exact-active {
  color: #3273dc;
}
</style>
