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
      :key="containerId"
      :program-id="programId"
      :repository-id="repositoryId"
      :container-id="containerId" />
  </div>
</template>

<script>
import ContentContainer from './ContentContainer';
import find from 'lodash/find';
import { mapGetters } from 'vuex';

export default {
  name: 'activity',
  props: {
    programId: { type: Number, required: true },
    repositoryId: { type: Number, required: true },
    activityId: { type: Number, required: true },
    containerId: { type: Number, required: true }
  },
  computed: {
    ...mapGetters('learner', ['courseware', 'isCoursewareFlat']),
    navigationItems() {
      const { activityId: id, courseware, isCoursewareFlat } = this;
      return isCoursewareFlat
        ? courseware
        : find(courseware, { subActivities: [{ id }] }).subActivities;
    }
  },
  components: { ContentContainer }
};
</script>

<style lang="scss" scoped>
.router-link-exact-active {
  color: #3273dc;
}
</style>
