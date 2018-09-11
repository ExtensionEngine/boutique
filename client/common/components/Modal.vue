<template>
  <div
    v-hotkey="{ escape: () => $emit('close') }"
    :class="{ 'is-active': show }"
    class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <slot></slot>
      </div>
    </div>
    <button @click="$emit('close')" class="modal-close is-large"></button>
  </div>
</template>

<script>
export default {
  props: {
    show: { type: Boolean, default: false }
  }
};
</script>

<style lang="scss">
.modal .modal-content {
  .box > div {
    padding: 20px 10px 5px;
  }

  .title {
    margin-bottom: 50px;
  }

  .controls {
    margin-top: 26px;

    .control.button {
      margin: 0;
      margin-left: 6px;
    }
  }
}
</style>
