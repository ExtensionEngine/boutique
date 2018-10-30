<template>
  <v-menu
    ref="menu"
    :disabled="disabled"
    full-width
    min-width="290px"
    offset-y
    transition="scale-transition">
    <v-text-field
      slot="activator"
      :value="normalizedValue"
      :label="label"
      :disabled="disabled"
      :error-messages="vErrors.collect(name)"
      append-icon="mdi-calendar"
      readonly/>
    <v-date-picker
      :value="normalizedValue"
      @input="save($event)"
      no-title/>
  </v-menu>
</template>

<script>
import fecha from 'fecha';

const DATE_FORMAT = 'YYYY-MM-DD';

export default {
  inject: ['$validator'],
  props: {
    value: { type: String, default: null },
    name: { type: String, required: true },
    label: { type: String, required: true },
    disabled: { type: Boolean, required: true },
    format: { type: String, default: DATE_FORMAT }
  },
  computed: {
    normalizedValue() {
      return this.normalize(this.value, this.format, DATE_FORMAT);
    }
  },
  methods: {
    save(value) {
      this.$emit('input', this.normalize(value, DATE_FORMAT, this.format));
      this.$refs.menu.save(value);
    },
    normalize(value, inputFormat, outputFormat) {
      if (!value) return;
      const date = fecha.parse(value, inputFormat);
      return fecha.format(date, outputFormat);
    }
  }
};
</script>
