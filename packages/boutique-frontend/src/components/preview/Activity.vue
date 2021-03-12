<template>
  <div>
    <template v-for="container in contentContainers">
      <content-container :key="container.id" :get-container="getContainer(container)" />
    </template>
  </div>
</template>

<script>
import ContentContainer from '@/components/common/ContentContainer.vue';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';

export default {
  name: 'preview-activity',
  props: {
    activity: { type: Object, required: true }
  },
  computed: {
    contentContainers() {
      const contentContainers = get(this.activity, 'containers', []);
      const rules = [['position'], ['desc', 'asc']];
      return orderBy(contentContainers, ...rules);
    }
  },
  methods: {
    getContainer(container) {
      return () => Promise.resolve(container);
    }
  },
  components: {
    ContentContainer
  }
};
</script>
