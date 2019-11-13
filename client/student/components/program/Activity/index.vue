<template>
  <div>
    <nav class="navbar is-light" role="navigation">
      <router-link
        v-for="item in navigationItems"
        :key="item.id"
        :to="{
          name: 'activity',
          params: {
            repositoryId,
            activityId: item.id,
            containerId: item.contentContainers[0].id
          }
        }"
        class="navbar-item">
        {{ item.name | truncate(25) }}
      </router-link>
    </nav>
    <content-container :key="containerId" :get-container="getContainer" />
  </div>
</template>

<script>
import api from '@/student/api/content';
import ContentContainer from '@/student/components/common/ContentContainer';
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
  methods: {
    getContainer() {
      const { programId, repositoryId, containerId } = this;
      return api.getContainer(programId, repositoryId, containerId);
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
