<template>
  <div>
    <nav class="navbar is-light" role="navigation">
      <v-btn
        v-for="{ id, name } in activities"
        :key="id"
        :to="{ name: 'activity', params: { repositoryId, activityId: id } }"
        class="mr-1"
        text>
        {{ name | truncate(25) }}
      </v-btn>
    </nav>
    <template v-for="container in contentContainers">
      <content-container
        :key="container.id"
        :get-container="getContainer(container.id)" />
    </template>
  </div>
</template>

<script>
import api from '@/api/content';
import ContentContainer from '@/components/common/ContentContainer.vue';
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
      const { activityId, activities } = this;
      return find(activities, { id: activityId }).contentContainers;
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
