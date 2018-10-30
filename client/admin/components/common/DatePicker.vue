<template>
  <v-menu
    :disabled="disabled"
    full-width
    min-width="290px"
    offset-y
    transition="scale-transition">
    <v-text-field
      v-validate="processedValidation"
      slot="activator"
      :name="name"
      :value="normalizedValue"
      :label="label"
      :disabled="disabled"
      :error-messages="vErrors.collect(name)"
      :data-vv-as="label"
      append-icon="mdi-calendar"
      readonly/>
    <v-date-picker :value="normalizedValue" @input="save($event)" no-title/>
  </v-menu>
</template>

<script>
import fecha from 'fecha';
import get from 'lodash/get';
import omit from 'lodash/omit';

const DATE_FORMAT = 'YYYY-MM-DD';

export default {
  inject: ['$validator'],
  props: {
    name: { type: String, required: true },
    value: { type: String, default: null },
    format: { type: String, default: DATE_FORMAT },
    validate: { type: Object, default: () => ({}) },
    disabled: { type: Boolean, default: false },
    label: { type: String, default: null }
  },
  computed: {
    normalizedValue() {
      return this.normalize(this.value, this.format, DATE_FORMAT);
    },
    processedValidation() {
      const { validate, format: inputFormat } = this;
      if (!get(validate, 'before') && !get(validate, 'after')) {
        return omit(validate, ['before', 'after']);
      }
      const tmp = { ...validate, date_format: DATE_FORMAT };
      ['before', 'after'].forEach(k => {
        tmp[k] && (tmp[k] = this.normalize(tmp[k], inputFormat, DATE_FORMAT));
      });
      return tmp;
    }
  },
  methods: {
    save(value) {
      this.$emit('input', this.normalize(value, DATE_FORMAT, this.format));
    },
    normalize(value, inputFormat, outputFormat) {
      if (!value) return;
      const date = fecha.parse(value, inputFormat);
      return fecha.format(date, outputFormat);
    }
  }
};
</script>
