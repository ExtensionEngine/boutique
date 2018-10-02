<template>
  <div>
    <circular-progress v-show="isLoading" class="loader"/>
    <div v-show="!isLoading" class="columns is-multiline">
      <tailor-teaching-elements
        v-for="it in teachingElements"
        :key="it.id"
        :element="it"
        :class="getElementWidth(it)"
        class="column"/>
    </div>
  </div>
</template>

<script>
import api from '@/student/api/content';
import CircularProgress from '../common/CircularProgress';
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
    return {
      container: null,
      isLoading: true
    };
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
      .then(container => {
        this.container = container;
        this.isLoading = false;
      });
  },
  components: { CircularProgress, TailorTeachingElements }
};
</script>

<style lang="scss" scoped>
.loader {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 50px;
  margin: auto;
}
</style>
