<template>
  <v-dialog v-hotkey="{ esc: close }" v-model="visible" width="700">
    <v-btn slot="activator" color="blue-grey" outline>
      <v-icon>cloud_upload</v-icon>Import
    </v-btn>
    <v-form @submit.prevent="save">
      <v-card class="pa-3">
        <v-card-title class="headline">
          Import Users
        </v-card-title>
        <v-card-text>
          <v-text-field
            ref="textFile"
            v-model="filename"
            :error-messages="vErrors.collect('file')"
            @click="selectFile"
            prepend-icon="attach_file"
            label="Upload .xls, .xlsx or .csv file"
            readonly
            single-line/>
          <input
            v-validate="rules"
            v-show="false"
            ref="fileInput"
            @change="onFileSelected"
            data-vv-name="file"
            type="file"/>
        </v-card-text>
        <v-card-text v-if="errors">
          <v-toolbar color="red" dark flat dense>
            <v-toolbar-title>Errors</v-toolbar-title>
          </v-toolbar>
          <v-list>
            <v-list-tile v-for="(error, index) in errors" :key="index">
              <v-list-tile-content>
                <v-list-tile-title>{{ error.user }}</v-list-tile-title>
                <v-list-tile-sub-title>
                  {{ error.message }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="close">Cancel</v-btn>
          <v-btn
            :disabled="disabled"
            color="success"
            type="submit">
            Import
          </v-btn>
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
  data() {
    return {
      visible: false,
      filename: null,
      form: null,
      disabled: true,
      rules: {
        required: true,
        mimes:
        [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
          'text/csv'
        ]
      },
      errors: null
    };
  },
  methods: {
    selectFile() {
      this.$refs.fileInput.click();
    },
    onFileSelected($event) {
      this.form = new FormData();
      this.errors = null;
      const file = head([...$event.target.files]);
      if (!file) {
        this.disabled = true;
        this.filename = null;
        return;
      }
      this.form.append('file', file, file.name);
      this.filename = file.name;
      this.disabled = false;
    },
    close() {
      this.disabled = true;
      this.filename = null;
      this.$refs.fileInput.value = null;
      this.visible = false;
    },
    save() {
      this.disabled = true;
      this.$validator.validateAll().then(isValid => {
        if (!isValid || this.errors) return;
        api.bulkImport(this.form).then(data => {
          if (data.errors.length) {
            this.$refs.textFile.focus();
            return (this.errors = data.errors);
          }
          this.$emit('imported');
          this.close();
        });
      });
    }
  },
  watch: {
    visible(val) {
      this.$nextTick(() => this.focusTrap.toggle(val));
      if (!val) return;
      this.vErrors.clear();
      this.errors = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.v-btn .v-icon {
  padding-right: 6px;
}
</style>
