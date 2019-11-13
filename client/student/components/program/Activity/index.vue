<template>
  <div>
    <nav class="navbar is-light" role="navigation">
      <router-link
        v-for="item in activities"
        :key="item.id"
        :to="{
          name: 'activity',
          params: {
            repositoryId,
            activityId: item.id
          }
        }"
        class="navbar-item">
        {{ item.name | truncate(25) }}
      </router-link>
    </nav>
    <template v-for="container in contentContainers">
      <content-container :key="container.id" :get-container="getContainer(container.id)" />
    </template>
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
    activityId: { type: Number, required: true }
  },
  computed: {
    ...mapGetters('learner', ['courseware', 'isCoursewareFlat']),
    activities() {
      const { activityId: id, courseware, isCoursewareFlat } = this;
      return isCoursewareFlat
        ? courseware
        : find(courseware, { subActivities: [{ id }] }).subActivities;
    },
    contentContainers() {
      return find(this.activities, { id: this.activityId }).contentContainers;
    }
  },
  methods: {
    getContainer(containerId) {
      const { programId, repositoryId } = this;
      return () => api.getContainer(programId, repositoryId, containerId);
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
