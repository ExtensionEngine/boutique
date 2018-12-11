<template>
  <v-dialog v-model="show" max-width="500">
    <v-form @submit.prevent="executeAction">
      <v-card>
        <v-card-title class="headline">{{ heading }}</v-card-title>
        <v-card-text>{{ message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="close" flat>Cancel</v-btn>
          <v-btn :disabled="isLoading" type="submit" color="red" flat>Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { withFocusTrap } from '@/common/focustrap';

const el = vm => vm.$children[0].$refs.dialog;

export default {
  name: 'confirmation-dialog',
  mixins: [withFocusTrap({ el })],
  props: {
    visible: { type: Boolean, default: false },
    heading: { type: String, default: '' },
    message: { type: String, default: 'Are you sure?' },
    action: { type: Function, default: () => true }
  },
  data: () => ({ isLoading: false }),
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
      this.isLoading = true;
      return Promise.resolve(this.action())
        .then(() => {
          this.close();
          this.$emit('confirmed');
        })
        .finally(() => (this.isLoading = false));
    }
  },
  watch: {
    show(val) {
      this.$nextTick(() => this.focusTrap.toggle(val));
    }
  }
};
</script>
