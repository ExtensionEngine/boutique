<template>
  <div>
    <tailorTeachingElements
      v-for="it in teachingElements"
      :key="it.id"
      :element="it"
      :class="getElementWidth(it)"
      class="column element"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import find from 'lodash/find';
import get from 'lodash/get';
import tailorTeachingElements from 'tailor-teaching-elements';

export default {
  name: 'teaching-elements',
  computed: {
    ...mapState('containers', { containers: 'items' }),
    ...mapGetters('auth', ['getUserCohort']),
    ...mapGetters('content', ['getContent']),
    containerId() {
      return this.$route.params.containerId;
    },
    container() {
      return find(this.containers, { id: this.containerId });
    },
    teachingElements() {
      return get(this.container, 'elements', []);
    },
    content() {
      return find(this.getContent, it => it.container.id === this.containerId);
    },
    courseId() {
      return this.content.courseId;
    }
  },
  methods: {
    ...mapActions('containers', ['get', 'setApiUrl']),
    getElementWidth(it) {
      return it.data.width === 6 ? 'is-6' : 'is-12';
    }
  },
  created() {
    this.setApiUrl({ cohortId: this.getUserCohort, courseId: this.courseId })
      .then(() => this.get(this.containerId));
  },
  components: { tailorTeachingElements }
};
</script>

<style lang="scss" scoped>
.element {
  padding: 10px !important;
}
</style>
