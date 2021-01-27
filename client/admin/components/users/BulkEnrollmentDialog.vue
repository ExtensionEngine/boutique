<template>
  <v-dialog
    v-model="visible"
    v-hotkey="{ esc: close }"
    :disabled="disabled"
    width="700"
    class="bulk-enrollment">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" :disabled="disabled" color="success" outlined class="ml-4">
        Enroll
      </v-btn>
    </template>
    <validation-observer
      ref="form"
      @submit.prevent="$refs.form.handleSubmit(submit)"
      tag="form"
      novalidate>
      <v-card class="pa-3">
        <v-card-title class="headline">Enroll users to Program</v-card-title>
        <v-card-text>
          <validation-provider
            v-slot="{ errors }"
            name="program">
            <v-autocomplete
              v-model="programId"
              :items="programOptions"
              :disabled="enrolling"
              :error-messages="errors"
              name="program"
              label="Program"
              placeholder="Start typing to Search"
              prepend-icon="mdi-magnify"
              clearable />
          </validation-provider>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="close" :disabled="enrolling">Cancel</v-btn>
          <v-btn
            :disabled="enrollDisabled"
            :loading="enrolling"
            color="success"
            type="submit">
            Enroll
          </v-btn>
        </v-card-actions>
      </v-card>
    </validation-observer>
  </v-dialog>
</template>

<script>
import api from '@/admin/api/enrollment';
import map from 'lodash/map';
import { mapState } from 'vuex';

export default {
  name: 'bulk-enrollment-dialog',
  props: {
    disabled: { type: Boolean, default: true },
    users: { type: Array, default: () => [] }
  },
  data: () => ({
    visible: false,
    programId: null,
    enrolling: false
  }),
  computed: {
    ...mapState('programs', { programs: 'items' }),
    programOptions: vm => map(vm.programs, it => ({ value: it.id, text: it.name })),
    enrollDisabled: vm => !vm.programId || vm.enrolling
  },
  methods: {
    submit() {
      this.enrolling = true;
      const { users, programId } = this;
      return api.create({ learnerId: map(users, 'id'), programId })
        .then(({ failed = [] }) => {
          if (failed.length <= 0) return this.close();
          const msg = `Enrolling failed for ${failed.length} users`;
          this.$refs.form.setErrors({ program: [msg] });
        })
        .catch(error => {
          const msg = 'Error! Unable to enroll Users!';
          this.$refs.form.setErrors({ program: [msg] });
          return Promise.reject(error);
        })
        .finally(() => (this.enrolling = false));
    },
    close() {
      this.visible = false;
      this.programId = null;
      this.$refs.form.reset();
    }
  }
};
</script>
