<template>
  <v-menu
    :disabled="disabled"
    min-width="290"
    transition="scale-transition"
    offset-y>
    <template v-slot:activator="{ on }">
      <v-text-field
        v-on="on"
        :name="name"
        :value="normalizedValue"
        :label="label"
        :disabled="disabled"
        :error-messages="errorMessages"
        append-icon="mdi-calendar"
        readonly />
    </template>
    <v-date-picker @input="save($event)" :value="normalizedValue" no-title />
  </v-menu>
</template>

<script>
import format from 'date-fns/format';
import parse from 'date-fns/parse';

const DATE_FORMAT = 'yyyy-MM-dd';

export default {
  props: {
    name: { type: String, required: true },
    value: { type: String, default: null },
    format: { type: String, default: DATE_FORMAT },
    errorMessages: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false },
    label: { type: String, default: null }
  },
  computed: {
    normalizedValue: vm => vm.normalize(vm.value, vm.format, DATE_FORMAT)
  },
  methods: {
    save(value) {
      this.$emit('input', this.normalize(value, DATE_FORMAT, this.format));
    },
    normalize(value, inputFormat, outputFormat) {
      if (!value) return;
      const date = parse(value, inputFormat, new Date());
      return format(date, outputFormat);
    }
  }
};
</script>
