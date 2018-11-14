<template>
  <v-dialog
    v-hotkey="{ esc: close }"
    v-model="visible"
    :disabled="disabled"
    width="700"
    class="bulk-enrollment">
    <v-btn slot="activator" :disabled="disabled" color="success" outline>
      Enroll
    </v-btn>
    <v-form @submit.prevent="submit">
      <v-card class="pa-3">
        <v-card-title class="headline">Enroll users to Program</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="programId"
            :items="programOptions"
            :disabled="enrolling"
            :error-messages="vErrors.collect('program')"
            name="program"
            label="Program"
            placeholder="Start typing to Search"
            prepend-icon="mdi-magnify"
            clearable/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn :disabled="enrolling" @click="close">Cancel</v-btn>
          <v-btn
            :disabled="enrollDisabled"
            :loading="enrolling"
            color="success"
            type="submit">
            Enroll
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import api from '@/admin/api/enrollment';
import map from 'lodash/map';
import { mapState } from 'vuex';
import { withFocusTrap } from '@/common/focustrap';
import { withValidation } from '@/common/validation';

const el = vm => vm.$children[0].$refs.dialog;

export default {
  name: 'bulk-enrollment-dialog',
  mixins: [withValidation(), withFocusTrap({ el })],
  props: {
    disabled: { type: Boolean, default: true },
    users: { type: Array, default: () => ([]) }
  },
  data() {
    return {
      visible: false,
      programId: null,
      enrolling: false
    };
  },
  computed: {
    ...mapState('programs', { programs: 'items' }),
    programOptions() {
      return map(this.programs, it => ({ text: `${it.name}`, value: it.id }));
    },
    enrollDisabled() {
      return !this.programId || this.enrolling;
    }
  },
  methods: {
    submit() {
      this.enrolling = true;
      const userIds = map(this.users, 'id');
      return api.create({ studentId: userIds, programId: this.programId })
        .then(({ failed = [] }) => {
          if (failed.length <= 0) return this.close();
          const msg = `Enrolling failed for ${failed.length} users`;
          this.vErrors.add({ field: 'program', msg });
        })
        .catch(error => {
          const msg = 'Error! Unable to enroll Users!';
          this.vErrors.add({ field: 'program', msg });
          return Promise.reject(error);
        })
        .finally(() => (this.enrolling = false));
    },
    close() {
      this.visible = false;
      this.programId = null;
      this.vErrors.clear();
    }
  }
};
</script>
