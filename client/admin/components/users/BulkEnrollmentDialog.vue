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
          <v-btn @click="close">Cancel</v-btn>
          <v-btn color="success" type="submit">Enroll</v-btn>
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
    userIds: { type: Array, default: () => ([]) }
  },
  data() {
    return {
      visible: false,
      programId: null
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
      this.userIds.forEach(userId => {
        enrollmentApi.create({ 'studentId': userId, 'programId': this.programId }).then(() => {
        });
      });
      this.close();
    },
    close() {
      this.visible = false;
    }
  }
};
</script>
