<template>
  <v-dialog v-model="show" max-width="500">
    <v-form>
      <v-card>
        <v-card-title class="headline">{{ heading }}</v-card-title>
        <v-card-text>{{ message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="close" flat>Cancel</v-btn>
          <v-btn
            v-for="(action, index) in actions"
            :key="index"
            @click="execute(action.callback)"
            type="submit"
            color="red"
            flat>
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

export default {
  name: 'multiple-choice-dialog',
  mixins: [withFocusTrap({ el })],
  props: {
    display: { type: Boolean, default: false },
    heading: { type: String, default: '' },
    message: { type: String, default: '' },
    actions: { type: Array, default: () => [] } // todo: validate
  },
  computed: {
    show: {
      get() {
        return this.display;
      },
      set(value) {
        if (!value) this.close();
      }
    }
  },
  methods: {
    close() {
      this.$emit('update:display', false);
    },
    execute(action) {
      return Promise.resolve(action()).then(() => {
        this.close();
        this.$emit('executed');
      });
    }
  },
  watch: {
    show(val) {
      this.$nextTick(() => this.focusTrap.toggle(val));
    }
  }
};
</script>
