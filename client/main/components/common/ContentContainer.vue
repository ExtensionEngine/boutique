<template>
  <div class="content-container">
    <v-progress-circular v-if="isLoading" size="50" indeterminate />
    <div v-else class="columns is-multiline">
      <tailor-teaching-elements
        v-for="element in container.elements"
        :key="element.id"
        :element="element"
        :class="['column', element.data.width === 6 ? 'is-6' : 'is-12']" />
    </div>
  </div>
</template>

<script>
import TailorTeachingElements from 'tailor-teaching-elements';

export default {
  name: 'content-container',
  props: {
    getContainer: { type: Function, required: true }
  },
  data: () => ({
    container: null,
    isLoading: true
  }),
  created() {
    return this.getContainer()
      .then(container => (this.container = container))
      .finally(() => (this.isLoading = false));
  },
  components: { TailorTeachingElements }
};
</script>

<style lang="scss" scoped>
.content-container {
  display: flex;
  justify-content: center;
  margin: 2.1875rem 0;

  .columns {
    flex: 1;
  }

  .te-container {
    padding: 0.625rem 0;
  }
}
</style>
