<template>
  <v-text-field
    :value="value"
    :error-messages="vErrors.collect(name)"
    :disabled="disabled"
    :label="label"
    @input="$emit('input', $event)"
    append-icon="edit"/>
</template>

<script>
export default {
  inject: ['$validator'],
  props: {
    value: { type: String, default: '' },
    name: { type: String, required: true },
    disabled: { type: Boolean, required: true },
    label: { type: String, required: true }
  }
};
</script>
