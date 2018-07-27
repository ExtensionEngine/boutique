<template>
  <span v-html="imageHtml" class="avatar-container"></span>
</template>

<script>
export default {
  name: 'user-avatar',
  props: ['image'],
  computed: {
    imageHtml() {
      if (!this.image) {
        return `<span class="icon is-medium mdi mdi-36px mdi-account-box"/>`;
      }
      return `
        <span class="icon is-medium mdi mdi-36px">
          <img src="${this.image}" class="avatar-image"/>
        </span>
      `;
    }
  }
};
</script>

<style lang="scss" scoped>
.avatar-container /deep/ {
  .avatar-image {
    border-radius: 5px;
    padding: 2px;
  }
}
</style>
