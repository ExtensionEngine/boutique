<template>
  <div :class="{ 'is-active': show }" class="modal">
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
