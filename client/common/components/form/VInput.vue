<template>
  <div class="field">
    <label class="label">{{ label }}</label>
    <div class="control">
      <input
        :value="value"
        :type="type"
        :name="name"
        :data-vv-as="label"
        :placeholder="label"
        v-bind="$attrs"
        v-validate="validate"
        data-vv-delay="1000"
        @input="$emit('input', $event.target.value)"
        class="input">
    </div>
    <p v-visible="showError" class="help is-danger">
      {{ vErrors.first(name) || '&nbsp;' }}
    </p>
  </div>
</template>

<script>
import humanize from 'humanize-string';

export default {
  name: 'v-input',
  props: {
    type: { type: String, default: 'text' },
    name: { type: String, required: true },
    value: { type: String, required: true },
    validate: { type: [String, Object] }
  },
  inheritAttrs: false,
  computed: {
    label() {
      return humanize(this.name);
    },
    showError() {
      return this.vErrors.has(this.name);
    }
  },
  inject: ['$validator']
};
</script>
