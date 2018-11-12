<template>
  <v-dialog
    v-hotkey="{ esc: close }"
    v-model="visible"
    :disabled="disabled"
    width="700"
    class="bulk-enrollment">
    <v-btn
      slot="activator"
      :disabled="disabled"
      color="success"
      outline>
      Enroll
    </v-btn>
    <v-form @submit.prevent="bulkEnroll">
      <v-card class="pa-3">
        <v-card-title class="headline">Enroll users to Program</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="programId"
            :items="programList"
            :disabled="enrollInProgress"
            :error-messages="enrollmentMessage"
            @focus="focusTrap.pause()"
            @blur="focusTrap.unpause()"
            name="program"
            label="Program"
            placeholder="Start typing to Search"
            prepend-icon="mdi-magnify"
            clearable/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn :disabled="enrollInProgress" @click="close">Cancel</v-btn>
          <v-btn
            :disabled="enrollDisabled"
            :loading="enrollInProgress"
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

const el = vm => vm.$children[0].$refs.dialog;

export default {
  name: 'bulk-enrollment-dialog',
  mixins: [withFocusTrap({ el })],
  props: {
    disabled: { type: Boolean, default: true },
    users: { type: Array, default: () => ([]) }
  },
  data() {
    return {
      visible: false,
      programId: null,
      enrollInProgress: false,
      enrollmentMessage: null
    };
  },
  computed: {
    ...mapState('programs', { programs: 'items' }),
    programList() {
      return map(this.programs, it => ({ text: `${it.name}`, value: it.id }));
    },
    enrollDisabled() {
      return !this.programId || this.enrollInProgress;
    }
  },
  methods: {
    bulkEnroll() {
      this.enrollInProgress = true;
      const { users, programId } = this;
      const userIds = map(users, 'id');
      return api.bulkEnroll({ userIds, programId })
        .then(res => {
          this.enrollInProgress = false;
          if (res.errorCount) {
            this.enrollmentMessage = `Enrolled failed for ${res.errorCount} users`;
            return;
          }
          this.close();
        })
        .catch(error => {
          this.enrollmentMessage = 'Error! Unable to enroll Users!';
          this.enrollInProgress = false;
          return Promise.reject(error);
        });
    },
    close() {
      this.visible = false;
      this.programId = null;
      this.enrollmentMessage = null;
    }
  }
};
</script>
