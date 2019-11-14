<template>
  <div class="loader-container">
    <circular-progress v-bind="$attrs" />
  </div>
</template>

<script>
import CircularProgress from './CircularProgress';
export default {
  name: 'ciruclar-progress-bar',
  components: {
    CircularProgress
  }
};
</script>

<style lang="scss" scoped>
.loader-container {
  display: flex;
  justify-content: center;
}
</style>
