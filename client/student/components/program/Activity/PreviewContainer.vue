<template>
  <div>
    <content-container
      :key="containerId"
      :getContainer="getContainer" />
  </div>
</template>

<script>
import api from '@/student/api/preview';
import ContentContainer from './ContentContainer';

export default {
  name: 'preview',
  props: {
    containerId: { type: Number, required: true }
  },
  methods: {
    async getContainer() {
      return api.getPreview(this.containerId);
    }
  },
  components: { ContentContainer }
};
</script>
