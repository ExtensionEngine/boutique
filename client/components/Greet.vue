<template>
  <div>
    <p class="message"><span class="icon mdi mdi-message"></span> {{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'greet',
  props: {
    message: { type: String, default: 'Hello World!' }
  }
};
</script>

<style lang="scss" scoped>
.message {
  text-align: center;
  color: lighten(#000, 16%);
}

.icon {
  color: lighten(#000, 38%);
}
</style>
