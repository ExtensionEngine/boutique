<template>
  <v-layout row wrap>
    <v-flex xs12 sm6 md4>
      <v-text-field
        ref="renameTextField"
        :disabled="disabled"
        :value="name"
        @input="val => $emit('update:name', val)"
        label="Program name"
        append-icon="edit"
      ></v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    name: { type: String, required: true },
    disabled: { type: Boolean, required: true }
  }
};
</script>
