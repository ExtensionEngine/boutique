<template>
  <div class="field">
    <label class="label">{{ label }}</label>
    <div class="control">
      <input
        @input="$emit('input', $event.target.value)"
        :value="value"
        :type="type"
        :name="name"
        :data-vv-as="label"
        :placeholder="label"
        v-bind="$attrs"
        data-vv-delay="1000"
        class="input">
    </div>
    <p v-visible="error" class="help is-danger">
      {{ error || '&nbsp;' }}
    </p>
  </div>
</template>

<script>
import humanize from 'humanize-string';

export default {
  name: 'v-input',
  inheritAttrs: false,
  props: {
    type: { type: String, default: 'text' },
    name: { type: String, required: true },
    value: { type: String, required: true },
    error: { type: String, default: null }
  },
  computed: {
    label() {
      return humanize(this.name);
    }
  }
};
</script>
