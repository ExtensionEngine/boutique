<template>
  <v-dialog v-model="show" max-width="500">
    <v-card>
      <v-card-title class="headline">{{ heading }}</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click.native="close" flat>Cancel</v-btn>
        <v-btn @click.native="executeAction" color="red" flat>Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Promise from 'bluebird';

export default {
  name: 'confirmation-dialog',
  props: {
    visible: { type: Boolean, default: false },
    heading: { type: String, default: '' },
    message: { type: String, default: 'Are you sure?' },
    action: { type: Function, default: () => true }
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) this.close();
      }
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false);
    },
    executeAction() {
      return Promise.resolve(this.action()).then(() => {
        this.close();
        this.$emit('confirmed');
      });
    }
  }
};
</script>
