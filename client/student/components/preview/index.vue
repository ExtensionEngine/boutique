<template>
  <div>
    <navbar />
    <div class="container">
      <activity v-if="activity" :activity="activity" />
      <div v-if="isLoading" class="loader-container">
        <circular-progress :height="50" :width="50" />
      </div>
    </div>
  </div>
</template>

<script>
import Activity from './Activity';
import api from '@/student/api/content';
import CircularProgress from '@/student/components/common/CircularProgress';
import Navbar from '@/student/components/common/Navbar';

export default {
  props: {
    contentPreviewId: { type: String, required: true }
  },
  data() {
    return {
      activity: null,
      isLoading: true
    };
  },
  created() {
    api.getPreview(this.contentPreviewId)
      .then(activity => {
        this.activity = activity;
        this.isLoading = false;
      });
  },
  components: {
    Activity,
    CircularProgress,
    Navbar
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 50px 0;
}

.loader-container {
  display: flex;
  justify-content: center;
}
</style>
