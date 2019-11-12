<template>
  <div>
    <template v-for="container in contentContainers">
      <content-container :key="container.id" :container="container" />
    </template>
  </div>
</template>

<script>
import ContentContainer from './common/ContentContainer';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';

export default {
  props: {
    activity: { type: Object, required: true }
  },
  computed: {
    contentContainers() {
      const contentContainers = get(this.activity, 'containers', []);
      const rules = [['type', 'position'], ['desc', 'asc']];
      return orderBy(contentContainers, ...rules);
    }
  },
  components: {
    ContentContainer
  }
};
</script>
