<template>
  <v-menu
    ref="menu"
    :close-on-content-click="false"
    :disabled="disabled"
    :nudge-right="40"
    :return-value.sync="value"
    full-width
    lazy
    min-width="290px"
    offset-y
    transition="scale-transition">
    <v-text-field
      slot="activator"
      :disabled="disabled"
      :error-messages="errorMessages"
      :label="label"
      :value="value"
      append-icon="event"
      readonly/>
    <v-date-picker :value="value" @input="save($event)" no-title=""/>
  </v-menu>
</template>

<script>
export default {
  props: {
    disabled: { type: Boolean, required: true },
    errorMessages: { type: Array, required: true },
    label: { type: String, required: true },
    value: { type: String, default: '' }
  },
  methods: {
    save(value) {
      this.$emit('input', value);
      this.$refs.menu.save(value);
    }
  }
};
</script>
