<template>
  <div class="system-font-stack">
    <img class="logo" src="../static/logo.png" alt="Logo">
    <p class="message">
      <span class="icon mdi mdi-message"></span>
      Hello world! 😉
    </p>
  </div>
</template>

<script>

export default {
  name: 'greet'
};
</script>

<style lang="scss" scoped>
.icon {
  color: lighten(#000, 38%);
}

.logo {
  display: block;
  width: auto;
  height: 64px;
  margin: 16px auto;
}

.message {
  text-align: center;
  color: lighten(#000, 16%);
  background-color: white !important;
}
</style>
