<template>
  <div class="field">
    <label class="label">{{ label }}</label>
    <div class="control">
      <input
        v-validate="validate"
        :value="value"
        :type="type"
        :name="name"
        :data-vv-as="label"
        :placeholder="label"
        v-bind="$attrs"
        @input="$emit('input', $event.target.value)"
        data-vv-delay="1000"
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
  inheritAttrs: false,
  props: {
    type: { type: String, default: 'text' },
    name: { type: String, required: true },
    value: { type: String, required: true },
    validate: { type: [String, Object], default: null }
  },
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
