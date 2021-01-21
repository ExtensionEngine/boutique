<template>
  <v-dialog
    ref="dialog"
    v-model="visible"
    v-hotkey="{ esc: close }"
    persistent
    no-click-animation
    width="700">
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
          <div
            :class="{ 'drop-file': isDragged }"
            class="select-file">
            <v-btn @click="launchFilePicker" color="info">
              <v-icon>mdi-upload</v-icon>
              Upload .xslx or .csv file
            </v-btn>
            <div>Or drag and drop file here</div>
            <v-chip v-if="filename" @input="removeFile" close>{{ filename }}</v-chip>
            <div class="errors-list">{{ vErrors.collect('file')[0] }}</div>
            <label for="userImportInput">
              <v-text-field
                ref="fileName"
                v-model="filename"
                :error-messages="vErrors.collect('file')"
                :disabled="importing"
                prepend-icon="mdi-attachment"
                label="Upload .xlsx or .csv file"
                readonly
                single-line />
              <input
                v-show="isDragged"
                ref="dropZone"
                v-validate="inputValidation"
                @change="onFileSelected"
                @dragend="hideDropZone"
                @dragover="showDropZone"
                @dragenter="showDropZone"
                @dragleave="hideDropZone"
                @drop="hideDropZone"
                class="drop-zone"
                name="file"
                type="file">
            </label>
          </div>
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

const inputFormats = {
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'text/csv': 'csv'
};

export default {
  name: 'import-dialog',
  data: () => ({
    visible: false,
    importing: false,
    filename: null,
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
        this.$refs.dialog.overlay.style.backgroundColor = 'rgba(0,191,255, 0.5)';
        this.isDragged = true;
      }
    },
    hideDropZone() {
      this.$refs.dialog.overlay.style.backgroundColor = '';
      this.isDragged = false;
    },
    removeFile() {
      this.filename = null;
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
        this.filename = null;
        return;
      }
      this.filename = file.name;
      return this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.form.append('file', file, file.name);
      });
    },
    close() {
      if (this.importing) return;
      this.filename = null;
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
        this.$refs.validationObserver.setErrors({ File: [`${count} users were successfully imported.`] });
        this.serverErrorsReport = data;
      }).catch(err => {
        this.importing = false;
        this.$refs.validationObserver.setErrors({ File: ['Importing users failed.'] });
        return Promise.reject(err);
      });
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
