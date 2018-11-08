<template>
  <v-dialog v-hotkey="{ esc: close }" :disabled="enrollDisabled" v-model="visible" width="700">
    <v-btn slot="activator" :disabled="enrollDisabled" color="success" outline>Enroll</v-btn>
    <v-form @submit.prevent="bulkEnroll">
      <v-card class="pa-3">
        <v-card-title class="headline">Enroll users to Program</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="programId"
            :items="programList"
            @focus="focusTrap.pause()"
            @blur="focusTrap.unpause()"
            label="Program"
            placeholder="Start typing to Search"
            prepend-icon="mdi-magnify"
            clearable
            name="program"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn :disabled="closeBtnDisabled" @click="close">Cancel</v-btn>
          <v-btn :disabled="enrollBtnDisabled" :loading="enrollBtnLoading" color="success" type="submit">Enroll</v-btn>
        </v-card-actions>
        <v-alert
          v-for="(message, index) in enrollmentMessages"
          :key="index"
          :value="showAlerts"
          :type="message.type"
          outline>
          {{ message.text }}
        </v-alert>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import enrollmentApi from '@/admin/api/enrollment';
import map from 'lodash/map';
import { mapState } from 'vuex';
import { withFocusTrap } from '@/common/focustrap';
import { withValidation } from '@/common/validation';

const el = vm => vm.$children[0].$refs.dialog;

export default {
  name: 'bulk-enrollment-dialog',
  mixins: [withValidation(), withFocusTrap({ el })],
  props: {
    enrollDisabled: { type: Boolean, default: true },
    users: { type: Array, default: () => ([]) }
  },
  data() {
    return {
      visible: false,
      programId: null,
      enrollBtnDisabled: false,
      closeBtnDisabled: false,
      enrollBtnLoading: false,
      enrollmentMessages: {},
      showAlerts: false
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
      enrollmentApi.bulkEnroll({ users: this.users, programId: this.programId })
        .then(res => {
          this.enrollmentMessages = res.messages;
          res.messages.length ? this.showAlerts = true : this.showAlerts = true;
          this.enrollFinished();
        });
    },
    close() {
      this.visible = false;
      this.enrollDialogDefault();
    },
    enrollDialogDefault() {
      this.enrollBtnDisabled = false;
      this.enrollBtnLoading = false;
      this.closeBtnDisabled = false;
      this.showAlerts = false;
    },
    enrollPending() {
      this.enrollBtnDisabled = true;
      this.enrollBtnLoading = true;
      this.closeBtnDisabled = true;
    },
    enrollFinished() {
      this.enrollBtnDisabled = true;
      this.enrollBtnLoading = false;
      this.closeBtnDisabled = false;
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
