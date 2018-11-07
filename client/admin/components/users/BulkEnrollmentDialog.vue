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
          <v-btn :disabled="enrollmentPending" @click="close">Cancel</v-btn>
          <v-btn :disabled="enrollmentPending" :loading="enrollmentPending" color="success" type="submit">Enroll</v-btn>
        </v-card-actions>
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
      enrollmentPending: false
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
      const userIds = map(this.users, 'id');
      this.enrollmentPending = true;
      enrollmentApi.bulkEnroll({ userIds: userIds, programId: this.programId })
        .then(res => {
          this.close();
          const programId = this.programId;
          this.$router.push({ name: 'enrollments', params: { programId } });
        });
    },
    close() {
      this.visible = false;
      this.enrollmentPending = false;
    }
  }
};
</script>
