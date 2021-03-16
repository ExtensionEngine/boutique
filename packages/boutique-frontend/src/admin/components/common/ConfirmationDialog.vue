<template>
  <admin-dialog v-model="visible" width="500" :header-icon="mdiAlert">
    <template v-slot:header>{{ heading }}</template>
    <template v-slot:body>
      <v-form @submit.prevent="executeAction">
        {{ message }}
        <div class="d-flex justify-end">
          <v-btn @click="close" text>Cancel</v-btn>
          <v-btn :disabled="isLoading" type="submit" color="error" text>
            Confirm
          </v-btn>
        </div>
      </v-form>
    </template>
  </admin-dialog>
</template>

<script>
import AdminDialog from '@/admin/components/common/Dialog';
import { mdiAlert } from '@mdi/js'

export default {
  name: 'confirmation-dialog',
  props: {
    visible: { type: Boolean, default: false },
    heading: { type: String, default: '' },
    message: { type: String, default: 'Are you sure?' },
    action: { type: Function, default: () => true }
  },
  data: () => ({ isLoading: false, mdiAlert }),
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
  components: { AdminDialog }
};
</script>
