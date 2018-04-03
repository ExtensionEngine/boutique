<template>
  <div class="field">
    <label class="label">{{ label }}</label>
    <div class="control">
      <input
        :value="value"
        :name="name"
        :data-vv-as="label"
        :placeholder="label"
        v-validate="validate"
        @input="$emit('input', $event.target.value)"
        class="input">
    </div>
    <p v-if="vErrors.has(name)" class="help is-danger">
      {{ vErrors.first(name) }}
    </p>
  </div>
</template>

<script>
import humanize from 'humanize-string';

export default {
  name: 'v-input',
  props: ['name', 'value', 'validate'],
  computed: {
    label() {
      return humanize(this.name);
    }
  },
  inject: ['$validator']
};
</script>
