<template>
  <div>
    <navbar />
    <div class="container">
      <circular-progress-bar v-if="isLoading" :height="50" :width="50" />
      <span v-else-if="error">{{ error }}</span>
      <preview-activity v-else :activity="activity" />
    </div>
  </div>
</template>

<script>
import api from '@/main/api/content';
import CircularProgressBar from '@/main/components/common/CircularProgressBar';
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
    api.getPreview(this.previewId)
      .then(activity => {
        this.activity = activity;
        this.isLoading = false;
      }).catch(e => {
        this.error = 'This preview is no longer available.';
        this.isLoading = false;
      });
  },
  components: {
    PreviewActivity,
    CircularProgressBar,
    Navbar
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 50px 0;
}
</style>
