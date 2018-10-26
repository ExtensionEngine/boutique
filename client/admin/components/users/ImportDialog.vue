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
            ref="fileText"
            v-model="filename"
            :error-messages="showErrors"
            :disabled="importing"
            @click="$refs.fileInput.click()"
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
            type="file">
        </v-card-text>
        <v-card-text v-show="importing" class="loader-container">
          <circular-progress :width="40" :height="40"/>
        </v-card-text>
        <v-card-actions v-show="!importing">
          <v-spacer/>
          <v-fade-transition>
            <v-btn
              v-show="visible && errors"
              @click="downloadErrorsFile"
              color="error">
              <v-icon>cloud_download</v-icon>Errors
            </v-btn>
          </v-fade-transition>
          <v-btn @click="close">Cancel</v-btn>
          <v-btn :disabled="disabled" color="success" type="submit">
            Import
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import api from '@/admin/api/user';
import CircularProgress from '@/common/components/CircularProgress';
import saveAs from 'save-as';
import { withFocusTrap } from '@/common/focustrap';
import { withValidation } from '@/common/validation';

const el = vm => vm.$children[0].$refs.dialog;
const rules = {
  required: true,
  mimes: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv'
  ]
};

export default {
  name: 'import-dialog',
  mixins: [withValidation(), withFocusTrap({ el })],
  data() {
    return {
      visible: false,
      importing: false,
      disabled: true,
      filename: null,
      form: null,
      errors: null,
      rules: rules
    };
  },
  computed: {
    showErrors() {
      return this.errors
        ? ['There were some erros.']
        : this.vErrors.collect('file');
    }
  },
  methods: {
    onFileSelected(e) {
      this.form = new FormData();
      this.errors = null;
      const [file] = Array.from(e.target.files);
      if (!file) {
        this.filename = null;
        return (this.disabled = true);
      }
      this.filename = file.name;
      this.form.append('file', file, file.name);
      this.$validator.validateAll().then(isValid => (this.disabled = !isValid));
    },
    close() {
      this.disabled = true;
      this.filename = null;
      this.$refs.fileInput.value = null;
      this.visible = false;
    },
    save() {
      this.disabled = true;
      this.importing = true;
      return api.bulkImport(this.form).then(response => {
        this.importing = false;
        if (response.data.size) {
          this.$nextTick(() => this.$refs.fileText.focus());
          return (this.errors = response.data);
        }
        this.$emit('imported');
        this.close();
      }).catch(err => {
        this.importing = false;
        this.errors = true;
        this.$nextTick(() => this.$refs.fileText.focus());
        return Promise.reject(err);
      });
    },
    downloadErrorsFile() {
      saveAs(this.errors, 'Errors.xlsx');
      this.$refs.fileText.focus();
    }
  },
  watch: {
    visible(val) {
      this.$nextTick(() => this.focusTrap.toggle(val));
      if (!val) return;
      this.vErrors.clear();
      this.errors = null;
    }
  },
  components: { CircularProgress }
};
</script>

<style lang="scss" scoped>
.v-btn .v-icon {
  padding-right: 6px;
}

.v-card__actions {
  margin-top: 20px;
}

.loader-container {
  display: flex;
  justify-content: center;
}
</style>
