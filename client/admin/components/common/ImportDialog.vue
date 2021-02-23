<template>
  <admin-dialog v-model="visible" width="600" header-icon="mdi-cloud-upload">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" color="primary" text>
        <v-icon dense class="mr-1">mdi-cloud-upload</v-icon>Import {{ label }}
      </v-btn>
    </template>
    <template v-slot:header>Import Users</template>
    <template v-slot:body>
      <validation-observer
        v-if="visible"
        ref="form"
        v-slot="{ invalid }"
        @submit.prevent="$refs.form.handleSubmit(submit)"
        tag="form"
        novalidate>
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
            <div class="errors-list mt-2">{{ errors[0] }}</div>
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
        <div class="d-flex align-center mb-2 mt-3">
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
          <v-btn @click="close" text>Cancel</v-btn>
          <v-btn :disabled="invalid" :loading="importing" type="submit" text>
            Import
          </v-btn>
        </div>
      </validation-observer>
    </template>
  </admin-dialog>
</template>

<script>
import AdminDialog from '@/admin/components/common/Dialog';
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
  },
  components: { AdminDialog }
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
