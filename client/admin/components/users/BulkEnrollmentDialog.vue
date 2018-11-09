<template>
  <v-dialog
    v-hotkey="{ esc: close }"
    v-model="visible"
    :disabled="disabled"
    width="700">
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
          <v-btn
            :disabled="enrollDisabled"
            @click="close">
            Cancel
          </v-btn>
          <v-btn
            :disabled="enrollDisabled"
            :loading="enrollInProgress"
            color="success"
            type="submit">
            Enroll
          </v-btn>
        </v-card-actions>
        <v-card-text>{{ enrollmentMessage }}</v-card-text>
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
      enrollDisabled: false,
      enrollInProgress: false,
      enrollmentMessage: '',
      showAlert: false
    };
  },
  computed: {
    ...mapState('programs', { programs: 'items' }),
    programList() {
      return map(this.programs, it => ({ text: `${it.name}`, value: it.id }));
    }
  },
  methods: {
    bulkEnroll() {
      this.enrollPending();
      return api.bulkEnroll({ users: this.users, programId: this.programId })
        .catch(() => (this.enrollmentMessage = 'Error! Unable to enroll Users!'))
        .then(res => {
          if (res.message.type === 'success') {
            this.close();
          } else {
            this.enrollmentMessage = res.message.text;
            this.showAlert = true;
            this.enrollFinished();
          }
        });
    },
    close() {
      this.visible = false;
      this.enrollDialogDefault();
    },
    enrollDialogDefault() {
      this.enrollDisabled = false;
      this.enrollInProgress = false;
      this.showAlert = false;
    },
    enrollPending() {
      this.enrollDisabled = true;
      this.enrollInProgress = true;
    },
    enrollFinished() {
      this.enrollDisabled = false;
      this.enrollInProgress = false;
    }
  }
};
</script>

<style lang="scss">

.v-alert {
  padding: 4px 10px 0;
  line-height: 30px;

  .v-alert__icon {
    margin-top: -5px;
    margin-right: 10px;
  }
}

</style>
