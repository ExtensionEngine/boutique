<template>
  <div class="elements">
    <circular-progress v-if="isLoading" class="loader"/>
    <div v-else class="columns is-multiline">
      <tailor-teaching-elements
        v-for="it in teachingElements"
        :key="it.id"
        :element="it"
        :class="['column', getElementWidth(it)]"/>
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
    repositoryId: { type: Number, required: true }
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
    api.getContainer(this.selectedProgram, this.repositoryId, this.containerId)
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
  top: auto;
  right: 0;
  bottom: auto;
  left: 0;
  width: 50px;
  height: 50px;
  margin: auto;
}

.elements {
  min-height: 100px;
  margin: 25px 0;
  padding: 20px;
  color: #363636;
  border: 1px solid lightgrey;
  border-radius: 3px;
}
</style>
