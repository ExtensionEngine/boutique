<template>
  <v-dialog
    v-model="visible"
    v-hotkey="{ esc: close }"
    :hide-overlay="!isDragged"
    overlay-opacity="0.5"
    overlay-color="#00bfff"
    width="700"
    persistent
    no-click-animation>
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" color="blue-grey" :disabled="disabled" outlined>
        <v-icon>mdi-cloud-upload</v-icon>Import {{ label }}
      </v-btn>
    </template>
    <validation-observer
      v-if="visible"
      ref="form"
      @submit.prevent="$refs.form.handleSubmit(submit)"
      tag="form"
      novalidate>
      <v-card class="pa-3">
        <v-card-title class="headline">Import Users</v-card-title>
        <v-card-text>
          <validation-provider v-slot="{ errors }" name="File" slim>
            <div :class="{ 'drop-file': isDragged }" class="select-file">
              <v-btn @click="launchFilePicker" color="info">
                <v-icon class="pr-2">mdi-upload</v-icon>
                Upload .xslx or .csv file
              </v-btn>
              <div class="my-3">Or drag and drop file here</div>
              <v-chip
                v-if="file"
                @input="removeFile"
                @click:close="removeFile"
                close>
                {{ file.name }}
              </v-chip>
              <div class="errors-list">{{ errors[0] }}</div>
              <label for="userImportInput">
                <input
                  v-show="isDragged"
                  ref="dropZone"
                  @change="onFileSelected"
                  @dragend="hideDropZone"
                  @dragover="showDropZone"
                  @dragenter="showDropZone"
                  @dragleave="hideDropZone"
                  @drop="hideDropZone"
                  :accept="acceptedFiles"
                  name="file"
                  type="file"
                  class="drop-zone">
              </label>
            </div>
          </validation-provider>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="downloadTemplateFile" text color="blue-grey">
            Download Template
          </v-btn>
          <v-spacer />
          <v-fade-transition>
            <v-btn
              v-show="serverErrorsReport"
              @click="downloadErrorsFile"
              color="error">
              <v-icon class="pr-2">mdi-cloud-download</v-icon>Errors
            </v-btn>
          </v-fade-transition>
          <v-btn @click="close">Cancel</v-btn>
          <v-btn :disabled="importDisabled" color="success" type="submit">
            <span v-if="!importing">Import</span>
            <v-icon v-else>mdi-loading mdi-spin</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </validation-observer>
  </v-dialog>
</template>

<script>
import api from '@/admin/api/import';
import pluralize from 'pluralize';
import saveAs from 'save-as';
import { validate } from 'vee-validate';

const inputFormats = {
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'text/csv': 'csv'
};

export default {
  name: 'import-dialog',
  props: {
    label: { type: String, required: true },
    baseUrl: { type: String, required: true },
    disabled: { type: Boolean, default: false },
    params: { type: Object, default: null }
  },
  data: () => ({
    visible: false,
    importing: false,
    file: null,
    form: null,
    isDragged: false,
    serverErrorsReport: null
  }),
  computed: {
    importDisabled: vm => !vm.file || vm.$refs.form.invalid || vm.importing,
    inputValidation: () => ({ required: true, mimes: Object.keys(inputFormats) }),
    acceptedFiles: () => Object.keys(inputFormats)
  },
  methods: {
    showDropZone() {
      if (this.visible) this.isDragged = true;
    },
    hideDropZone() {
      this.isDragged = false;
    },
    removeFile() {
      this.file = null;
      this.form = null;
      this.$refs.dropZone.value = null;
      this.isDragged = false;
      this.resetErrors();
    },
    launchFilePicker() {
      this.$refs.dropZone.click();
    },
    async onFileSelected(e) {
      this.form = new FormData();
      this.resetErrors();
      const [file] = e.target.files;
      if (!file) return (this.file = null);
      this.file = file;
      const result = await validate(file, this.inputValidation, { name: 'File' });
      const { valid, errors } = result;
      if (!valid) return this.$refs.form.setErrors({ File: errors });
      this.form.append('file', file, file.name);
    },
    close() {
      if (this.importing) return;
      this.file = null;
      this.isDragged = false;
      this.$refs.dropZone.value = null;
      this.resetErrors();
      this.visible = false;
    },
    submit() {
      this.importing = true;
      const { file, label, baseUrl, params } = this;
      this.form = new FormData();
      this.form.append('file', file, file.name);
      return api.bulkImport(this.form, { baseUrl, params })
        .then(({ data, count }) => {
          this.importing = false;
          if (count) this.$emit('imported');
          if (!data.size) return this.close();
          const msg = `${count} ${pluralize(label, count)} were successfully imported.`;
          this.$refs.form.setErrors({ File: [msg] });
          this.serverErrorsReport = data;
        })
        .catch(err => {
          this.importing = false;
          this.$refs.form.setErrors({ File: [`Importing ${label} failed.`] });
          return Promise.reject(err);
        });
    },
    resetErrors() {
      this.$refs.form.reset();
      this.serverErrorsReport = null;
    },
    downloadErrorsFile() {
      const extension = inputFormats[this.serverErrorsReport.type];
      saveAs(this.serverErrorsReport, `Errors.${extension}`);
    },
    async downloadTemplateFile() {
      const { label, baseUrl } = this;
      const { data } = await api.getImportTemplate({ baseUrl });
      return saveAs(data, `${label}Template.xlsx`);
    }
  },
  mounted() {
    window.addEventListener('dragenter', this.showDropZone);
  },
  beforeDestroy() {
    window.removeEventListener('dragenter', this.showDropZone);
  }
};
</script>

<style lang="scss" scoped>
.select-file {
  padding: 3.125rem 0.625rem;
  text-align: center;
  color: gray;
  background-color: #f5f5f5;
  border-radius: 0.3125rem;
}

.drop-file {
  background-color: #eee;
  outline: 2px dashed #aaa;
  outline-offset: -0.625rem;
}

.errors-list {
  color: red;
}

.drop-zone {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}
</style>
