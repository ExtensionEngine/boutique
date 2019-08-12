<template>
  <v-dialog v-model="show" max-width="500">
    <v-form>
      <v-card>
        <v-card-title class="headline">{{ heading }}</v-card-title>
        <v-card-text class="pb-1">{{ message }}</v-card-text>
        <v-card-text v-if="warning" class="pt-1 caption">
          <span class="warning-label">Warning:</span>
          {{ warning }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="close" text>Cancel</v-btn>
          <v-btn
            v-for="(action, index) in actions"
            :key="index"
            @click="execute(action.callback)"
            :disabled="isLoading"
            type="submit"
            color="red"
            text>
            {{ action.label }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { withFocusTrap } from '@/common/focustrap';

const el = vm => vm.$children[0].$refs.dialog;
const validator = actions => {
  if (!(actions instanceof Array)) return false;
  return actions.every(el => el.label && el.callback);
};

export default {
  name: 'multiple-choice-dialog',
  mixins: [withFocusTrap({ el })],
  props: {
    visible: { type: Boolean, default: false },
    heading: { type: String, default: '' },
    message: { type: String, default: '' },
    warning: { type: String, default: '' },
    actions: { type: Array, default: () => [], validator: validator }
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
      this.$emit('closed', false);
    },
    execute(action) {
      this.isLoading = true;
      return Promise.resolve(action())
        .then(() => {
          this.close();
          this.$emit('completed');
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

<style lang="scss" scoped>
.warning-label {
  color: red;
}
</style>
