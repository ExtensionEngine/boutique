<template>
  <div>
    <tailorTeachingElements
      v-for="it in teachingElements"
      :key="it.id"
      :element="it"
      :class="getElementWidth(it)"
      class="column"
    />
  </div>
</template>

<script>
import contentApi from '@/student/api/contentApi';
import find from 'lodash/find';
import { mapGetters } from 'vuex';
import tailorTeachingElements from 'tailor-teaching-elements';

export default {
  name: 'teaching-elements',
  data() {
    return { container: {} };
  },
  computed: {
    ...mapGetters('auth', ['userCohortId']),
    ...mapGetters('content', ['courseware']),
    containerId() {
      return this.$route.params.containerId;
    },
    teachingElements() {
      return this.container.elements;
    },
    activity() {
      return find(this.courseware, it => it.container.id === this.containerId);
    },
    courseId() {
      return this.activity.courseId;
    }
  },
  methods: {
    getElementWidth(it) {
      return it.data.width === 6 ? 'is-6' : 'is-12';
    }
  },
  created() {
    contentApi.getContainer(this.userCohortId, this.courseId, this.containerId)
      .then(container => {
        this.container = container;
      });
  },
  components: { tailorTeachingElements }
};
</script>

<style lang="scss" scoped>
</style>
