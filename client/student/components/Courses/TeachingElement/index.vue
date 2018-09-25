<template>
  <div v-if="elements" class="columns is-multiline elements">
    <tailorTeachingElements
      v-for="it in elements"
      :key="it.id"
      :element="it"
      :class="getWidth(it.data.width)"
      class="column element"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import find from 'lodash/find';
import tailorTeachingElements from 'tailor-teaching-elements';

export default {
  name: 'courses',
  computed: {
    ...mapState('containers', { containers: 'items' }),
    elements() {
      const { teId } = this.$route.params;
      const container = find(this.containers, { id: teId });
      if (!container) return;
      return container.elements;
    }
  },
  methods: {
    ...mapActions('containers', ['get']),
    getWidth(width) {
      return `is-${width}`;
    }
  },
  created() {
    const { teId } = this.$route.params;
    this.get(teId);
  },
  components: { tailorTeachingElements }
};
</script>

<style lang="scss" scoped>
.elements {
  padding: 30px 300px 100px;
}

.element {
  padding: 10px !important;
}
</style>
