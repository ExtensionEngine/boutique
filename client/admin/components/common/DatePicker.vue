<template>
  <v-menu
    ref="menu"
    :disabled="disabled"
    :return-value.sync="value"
    full-width
    min-width="290px"
    offset-y
    transition="scale-transition">
    <v-text-field
      slot="activator"
      :value="value"
      :label="label"
      :disabled="disabled"
      :error-messages="vErrors.collect(name)"
      append-icon="event"
      readonly/>
    <v-date-picker :value="value" @input="save($event)" no-title/>
  </v-menu>
</template>

<script>
export default {
  inject: ['$validator'],
  props: {
    value: { type: String, default: '' },
    name: { type: String, required: true },
    disabled: { type: Boolean, required: true },
    label: { type: String, required: true }
  },
  methods: {
    save(value) {
      this.$emit('input', value);
      this.$refs.menu.save(value);
    }
  }
};
</script>
