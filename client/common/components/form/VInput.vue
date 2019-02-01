<template>
  <div class="field">
    <label class="label">{{ label }}</label>
    <div class="control">
      <input
        v-validate="validate"
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
    type: {
      type: String,
      default: 'text'
    },
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default() {
        return humanize(this.name);
      }
    },
    value: {
      type: String,
      required: true
    },
    validate: {
      type: [String, Object],
      default: null
    }
  },
  computed: {
    showError() {
      return this.vErrors.has(this.name);
    }
  },
  inject: ['$validator'],
  beforeDestroy() {
    this.$validator.pause();
  }
};
</script>
