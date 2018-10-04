<template>
  <div class="elements">
    <circular-progress v-if="isLoading" :height="50" :width="50"/>
    <div v-else class="columns is-multiline">
      <tailor-teaching-elements
        v-for="it in container.elements"
        :key="it.id"
        :element="it"
        :class="['column', it.data.width === 6 ? 'is-6' : 'is-12']"/>
    </div>
  </div>
</template>

<script>
import api from '@/student/api/content';
import CircularProgress from '../common/CircularProgress';
import { mapState } from 'vuex';
import TailorTeachingElements from 'tailor-teaching-elements';

export default {
  name: 'content-container',
  props: {
    repositoryId: { type: Number, required: true },
    containerId: { type: Number, required: true }
  },
  data() {
    return {
      container: null,
      isLoading: true
    };
  },
  computed: mapState('learner', ['selectedProgramId']),
  created() {
    api.getContainer(this.selectedProgramId, this.repositoryId, this.containerId)
      .then(container => {
        this.container = container;
        this.isLoading = false;
      });
  },
  components: { CircularProgress, TailorTeachingElements }
};
</script>

<style lang="scss" scoped>
.elements {
  display: flex;
  justify-content: center;
  margin: 35px 0;
}
</style>
