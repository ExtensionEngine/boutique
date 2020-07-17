<template>
  <div>
    <nav class="navbar is-light" role="navigation">
      <v-btn
        v-for="item in activities"
        :key="item.id"
        :to="{
          name: 'activity',
          params: {
            repositoryId,
            activityId: item.id
          }
        }"
        class="mr-1"
        text>
        {{ item.name | truncate(25) }}
      </v-btn>
    </nav>
    <template v-for="container in contentContainers">
      <content-container :key="container.id" :get-container="getContainer(container.id)" />
    </template>
  </div>
</template>

<script>
import api from '@/main/api/content';
import ContentContainer from '@/main/components/common/ContentContainer';
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
