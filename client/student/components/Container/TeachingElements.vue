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
import { mapActions, mapState } from 'vuex';
import find from 'lodash/find';
import tailorTeachingElements from 'tailor-teaching-elements';

export default {
  name: 'teaching-elements',
  computed: {
    ...mapState('containers', { containers: 'items' }),
    containerId() {
      return parseInt(this.$route.params.containerId, 10);
    },
    teachingElements() {
      const container = find(this.containers, { id: this.containerId });
      if (!container) return;
      return container.elements;
    }
  },
  methods: {
    ...mapActions('containers', ['get']),
    getElementWidth(it) {
      return it.data.width === 6 ? 'is-6' : 'is-12';
    }
  },
  created() {
    this.get(this.containerId);
  },
  components: { tailorTeachingElements }
};
</script>

<style lang="scss" scoped>
.element {
  padding: 10px !important;
}
</style>
