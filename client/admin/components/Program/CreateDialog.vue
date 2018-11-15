<template>
  <v-dialog v-hotkey="{ esc: close }" v-model="visible" width="600">
    <v-btn slot="activator" small flat>Create</v-btn>
    <v-form @submit.prevent="save">
      <v-card class="pa-3">
        <v-card-title class="headline">New Program</v-card-title>
        <v-card-text>
          <v-text-field
            v-validate="{
              required: true,
              min: 2,
              max: 255,
              'unique:program.name': null
            }"
            v-model.trim="program.name"
            :error-messages="vErrors.collect('name')"
            label="Name"
            data-vv-name="name"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="close">Cancel</v-btn>
          <v-btn color="success" outline type="submit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import { withFocusTrap } from '@/common/focustrap';
import { withValidation } from '@/common/validation';

const el = vm => vm.$children[0].$refs.dialog;
const getDefaultData = () => ({ name: '' });

export default {
  name: 'program-dialog',
  mixins: [withValidation(), withFocusTrap({ el })],
  data() {
    return {
      visible: false,
      program: getDefaultData()
    };
  },
  methods: {
    ...mapActions('programs', { saveProgram: 'save' }),
    close() {
      this.visible = false;
    },
    save() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.saveProgram(this.program);
        this.close();
      });
    }
  },
  watch: {
    visible(val) {
      this.$nextTick(() => this.focusTrap.toggle(val));
      if (!val) return;
      this.program = getDefaultData();
      this.vErrors.clear();
    }
  }
};
</script>
