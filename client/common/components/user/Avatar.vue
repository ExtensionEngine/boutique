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
const avatarDimension = {
  type: Number,
  default: 30,
  validator: value => value && value <= 100
};

export default {
  name: 'user-avatar',
  props: {
    image: String,
    width: avatarDimension,
    height: avatarDimension
  }
};
</script>

<style lang="scss" scoped>
  .avatar {
    &-container {
      display: inline-grid;
      padding: 1px;
    }

    &-image {
      box-sizing: border-box;
      border-radius: 5px;
      border: 1px solid #aaa;
    }
  }
</style>
