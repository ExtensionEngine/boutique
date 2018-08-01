<template>
  <div
    class="avatar-container"
    :width="width"
    :height="height">
    <img
      :src="image"
      :width="width"
      :height="height"
      class="avatar-image"/>
  </div>
</template>

<script>
export default {
  name: 'user-avatar',
  props: {
    image: String,
    width: { type: Number, default: 30 },
    height: { type: Number, default: 30 }
  }
};
</script>

<style lang="scss" scoped>
  .avatar {
    &-container {
      display: inline-grid;
      padding: 1px;
      padding-bottom: 5px !important;
    }

    &-image {
      box-sizing: content-box;
      border-radius: 5px;
      border: 1px solid #aaa;
    }
  }
</style>
