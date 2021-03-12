<template>
  <admin-dialog v-model="show" header-icon="mdi-alert">
    <template v-slot:header>{{ heading }}</template>
    <template v-slot:body>
      <div class="mb-1 text-subtitle-1">{{ message }}</div>
      <div v-if="warning" class="mb-2 text-caption">
        <span class="error--text">Warning:</span>
        {{ warning }}
      </div>
      <div class="d-flex justify-end my-2">
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
      </div>
    </template>
  </admin-dialog>
</template>

<script>
import AdminDialog from '@/admin/components/common/Dialog.vue';

const validator = actions => {
  if (!(actions instanceof Array)) return false;
  return actions.every(el => el.label && el.callback);
};

export default {
  name: 'multiple-choice-dialog',
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
      get: vm => vm.visible,
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
  components: { AdminDialog }
};
</script>
