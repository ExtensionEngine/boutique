<template>
  <div>
    <span v-html="imageHtml" class="avatar-image"></span>
    <span class="additional-content">
      <slot>Options</slot>
    </span>
  </div>
</template>

<script>
export default {
  name: 'user-header',
  props: ['image'],
  computed: {
    imageHtml() {
      if (!this.image) {
        return `<span class="icon is-medium mdi mdi-36px mdi-account-box"/>`;
      }
      return ''; // TODO: display user avatar as a 25x25 icon
    }
  }
};
</script>

<style lang="scss" scoped>
.avatar-image {
  margin-right: 10px;
}

.additional-content {
  vertical-align: top;
  text-align: center;
}
</style>
