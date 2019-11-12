<template>
  <div class="content-container">
    <div class="columns is-multiline">
      <tailor-teaching-elements
        v-for="it in container.elements"
        :key="it.id"
        :element="it"
        :class="['column', it.data.width === 6 ? 'is-6' : 'is-12']" />
    </div>
  </div>
</template>

<script>
import TailorTeachingElements from 'tailor-teaching-elements';

export default {
  name: 'content-container',
  props: {
    container: { type: Object, required: true }
  },
  components: { TailorTeachingElements }
};
</script>

<style lang="scss" scoped>
.content-container {
  display: flex;
  justify-content: center;
  margin: 35px 0;

  .columns {
    flex: 1;
  }
}
</style>
