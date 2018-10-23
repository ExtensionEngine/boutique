<template>
  <v-dialog v-hotkey="{ esc: close }" v-model="show" width="700">
    <v-form @submit.prevent="save">
      <v-card class="pa-3">
        <v-card-title class="headline">
          Import Users
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="filename"
            :error-messages="vErrors.collect('file')"
            @click.native="pickFile"
            prepend-icon="attach_file"
            label="Upload .xlsx file"
            readonly
            single-line/>
          <input
            v-validate="rules"
            v-show="false"
            ref="fileInput"
            @change="onFileChange"
            data-vv-name="file"
            type="file"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="close">Cancel</v-btn>
          <v-btn color="success" type="submit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import api from '@/admin/api/user';
import head from 'lodash/head';
import { withFocusTrap } from '@/common/focustrap';
import { withValidation } from '@/common/validation';

const el = vm => vm.$children[0].$refs.dialog;

export default {
  name: 'import-dialog',
  mixins: [withValidation(), withFocusTrap({ el })],
  props: {
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      filename: null,
      form: new FormData(),
      rules: {
        required: true,
        mimes:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    };
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) this.close();
      }
    }
  },
  methods: {
    pickFile() {
      this.form = new FormData();
      this.$refs.fileInput.click();
    },
    onFileChange($event) {
      const file = head([...$event.target.files]);
      this.form.append('file', file, file.name);
      this.filename = file.name;
    },
    close() {
      this.form = new FormData();
      this.filename = null;
      this.$refs.fileInput.value = null;
      this.$emit('update:visible', false);
    },
    save() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        api.bulkCreate(this.form).then(() => {
          this.$emit('imported');
          this.close();
        });
      });
    }
  },
  watch: {
    show(val) {
      this.$nextTick(() => this.focusTrap.toggle(val));
      if (!val) return;
      this.vErrors.clear();
    }
  }
};
</script>
