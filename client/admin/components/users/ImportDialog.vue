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
      <v-btn v-on="on" color="blue-grey" outlined>
        <v-icon>mdi-cloud-upload</v-icon>Import
      </v-btn>
    </template>
    <validation-observer
      v-if="visible"
      ref="form"
      v-slot="{ invalid }"
      @submit.prevent="$refs.form.handleSubmit(submit)"
      tag="form"
      novalidate>
      <v-card class="pa-3">
        <v-card-title class="headline">Import Users</v-card-title>
        <v-card-text>
          <validation-provider v-slot="{ errors }" name="File" slim>
            <div
              :class="{ 'drop-file': isDragged }"
              class="select-file">
              <v-btn @click="launchFilePicker" color="info">
                <v-icon>mdi-upload</v-icon>
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
                  class="drop-zone"
                  name="file"
                  type="file">
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
              <v-icon>mdi-cloud-download</v-icon>Errors
            </v-btn>
          </v-fade-transition>
          <v-btn @click="close">Cancel</v-btn>
          <v-btn :disabled="importing || invalid" color="success" type="submit">
            <span v-if="!importing">Import</span>
            <v-icon v-else>mdi-loading mdi-spin</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </validation-observer>
  </v-dialog>
</template>

<script>
import api from '@/admin/api/user';
import saveAs from 'save-as';
import { validate } from 'vee-validate';

const inputFormats = {
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'text/csv': 'csv'
};

export default {
  name: 'import-dialog',
  data: () => ({
    visible: false,
    importing: false,
    file: null,
    form: null,
    isDragged: false,
    serverErrorsReport: null
  }),
  computed: {
    inputValidation: () => ({ required: true, mimes: Object.keys(inputFormats) }),
    acceptedFiles: () => Object.keys(inputFormats)
  },
  methods: {
    showDropZone() {
      if (this.visible) {
        this.isDragged = true;
      }
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
    onFileSelected(e) {
      this.form = new FormData();
      this.resetErrors();
      const [file] = e.target.files;
      if (!file) {
        this.file = null;
        return;
      }
      this.file = file;
      return validate(file, this.inputValidation, { name: 'File' }).then(result => {
        const { valid, errors } = result;
        if (valid) {
          this.form.append('file', file, file.name);
          return;
        }
        this.$refs.form.setErrors({ File: errors });
      });
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
      const { file } = this;
      this.form = new FormData();
      this.form.append('file', file, file.name);
      return api.bulkImport(this.form).then(({ data, count }) => {
        this.importing = false;
        if (count) this.$emit('imported');
        if (!data.size) return this.close();
        this.$refs.form.setErrors({ File: [`${count} users were successfully imported.`] });
        this.serverErrorsReport = data;
      }).catch(err => {
        this.importing = false;
        this.$refs.form.setErrors({ File: ['Importing users failed.'] });
        return Promise.reject(err);
      });
    },
    resetErrors() {
      this.$refs.form.reset();
    },
    downloadErrorsFile() {
      const extension = inputFormats[this.serverErrorsReport.type];
      saveAs(this.serverErrorsReport, `Errors.${extension}`);
    },
    downloadTemplateFile() {
      return api.getImportTemplate().then(response => {
        saveAs(response.data, 'Template.xlsx');
      });
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
.v-btn .v-icon {
  padding-right: 6px;
}

.v-card__actions {
  margin-top: 20px;
}

.select-file {
  padding: 50px 10px;
  text-align: center;
  color: gray;
  background-color: #f5f5f5;
  border-radius: 5px;
}

.drop-file {
  background-color: #eee;
  outline: 2px dashed #aaa;
  outline-offset: -10px;
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
