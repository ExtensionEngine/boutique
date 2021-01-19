<template>
  <div>
    <navbar />
    <div class="container">
      <v-progress-circular v-if="isLoading" size="50" indeterminate />
      <span v-else-if="error">{{ error }}</span>
      <preview-activity v-else :activity="activity" />
    </div>
  </div>
</template>

<script>
import api from '@/main/api/content';
import Navbar from '@/main/components/common/Navbar';
import PreviewActivity from './Activity';

export default {
  name: 'content-preview',
  props: {
    previewId: { type: Number, required: true }
  },
  data: () => ({
    activity: null,
    isLoading: true,
    error: null
  }),
  created() {
    return api.getPreview(this.previewId)
      .then(activity => {
        this.activity = activity;
        this.isLoading = false;
      }).catch(e => {
        this.error = 'This preview is no longer available.';
        this.isLoading = false;
      });
  },
  components: { PreviewActivity, Navbar }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 3.125rem 0;
}
</style>
