<template>
  <div>
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
import { mapActions, mapGetters, mapState } from 'vuex';
import find from 'lodash/find';
import tailorTeachingElements from 'tailor-teaching-elements';

export default {
  name: 'te',
  computed: {
    ...mapState('containers', { containers: 'items' }),
    teId() {
      const { teId } = this.$route.params;
      return teId;
    },
    elements() {
      const container = find(this.containers, { id: this.teId });
      if (!container) return;
      return container.elements;
    }
  },
  methods: {
    ...mapActions('containers', ['get']),
    ...mapGetters('courses', ['getContent']),
    getWidth(width) {
      return `is-${width}`;
    }
  },
  created() {
    this.get(this.teId);
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
