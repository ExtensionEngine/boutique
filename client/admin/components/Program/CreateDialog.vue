<template>
  <v-dialog v-model="visible" v-hotkey="{ esc: close }" width="600">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" small text>Create</v-btn>
    </template>
    <validation-observer
      v-if="visible"
      ref="form"
      @submit.prevent="$refs.form.handleSubmit(save)"
      tag="form"
      novalidate>
      <v-card class="pa-3">
        <v-card-title class="headline">New Program</v-card-title>
        <v-card-text>
          <validation-provider
            v-slot="{ errors }"
            name="Name"
            :rules="{ required: true, min: 2, max: 255, unique_program_name: null }">
            <v-text-field
              v-model.trim="program.name"
              :error-messages="errors"
              label="Name" />
          </validation-provider>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="close">Cancel</v-btn>
          <v-btn color="success" outlined type="submit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </validation-observer>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import { withFocusTrap } from '@/common/focustrap';

const el = vm => vm.$children[0].$refs.dialog;
const getDefaultData = () => ({ name: '' });

export default {
  name: 'program-dialog',
  mixins: [withFocusTrap({ el })],
  data: () => ({
    visible: false,
    program: getDefaultData()
  }),
  methods: {
    ...mapActions('programs', { saveProgram: 'save' }),
    close() {
      this.visible = false;
    },
    save() {
      this.saveProgram(this.program);
      this.close();
    }
  },
  watch: {
    visible(val) {
      this.$nextTick(() => this.focusTrap.toggle(val));
      if (!val) return;
      this.program = getDefaultData();
    }
  }
};
</script>
