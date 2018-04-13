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
        v-validate="validate"
        @input="$emit('input', $event.target.value)"
        class="input">
    </div>
    <p :style="showError" class="help is-danger">
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
  computed: {
    label() {
      return humanize(this.name);
    },
    showError() {
      const visibility = this.vErrors.has(this.name) ? 'visible' : 'hidden';
      return { visibility };
    }
  },
  inject: ['$validator']
};
</script>
