<template>
  <div class="columns is-multiline">
    <tailor-teaching-elements
      v-for="it in teachingElements"
      :key="it.id"
      :element="it"
      :class="getElementWidth(it)"
      class="column"/>
  </div>
</template>

<script>
import api from '@/student/api/content';
import get from 'lodash/get';
import { mapState } from 'vuex';
import TailorTeachingElements from 'tailor-teaching-elements';

export default {
  name: 'teaching-elements',
  props: {
    containerId: { type: Number, required: true },
    courseId: { type: Number, required: true }
  },
  data() {
    return { container: null };
  },
  computed: {
    ...mapState('learner', ['selectedProgram']),
    teachingElements() {
      return get(this.container, 'elements', []);
    }
  },
  methods: {
    getElementWidth(it) {
      return it.data.width === 6 ? 'is-6' : 'is-12';
    }
  },
  created() {
    api.getContainer(this.selectedProgram, this.courseId, this.containerId)
      .then(container => (this.container = container));
  },
  components: { TailorTeachingElements }
};
</script>
