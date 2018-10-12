<template>
  <v-layout row wrap>
    <v-flex xs12 sm6 md4>
      <v-text-field
        ref="renameTextField"
        :readonly="disabled"
        v-model="newName"
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
  },
  data() {
    return {
      newName: ' '
    };
  },
  watch: {
    newName: function () {
      this.$emit('update:name', this.newName);
    },
    disabled: function () {
      this.disabled
        ? this.$refs.renameTextField.blur()
        : this.$refs.renameTextField.focus();
    }
  },
  mounted() {
    this.newName = this.name;
  }
};
</script>
