<template>
  <div>
    <navbar />
    <div class="container">
      <circular-progress-bar v-if="isLoading" :height="50" :width="50" />
      <span v-else-if="error">{{ error }}</span>
      <activity v-else :activity="activity" />
    </div>
  </div>
</template>

<script>
import Activity from './Activity';
import api from '@/student/api/content';
import CircularProgressBar from '@/student/components/common/CircularProgressBar';
import Navbar from '@/student/components/common/Navbar';

export default {
  name: 'preview',
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
    Activity,
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
